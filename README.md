## 선행 파일 준비
### .env
#### auth-server/.env
```text
MONGODB_USERNAME=root
MONGODB_PASSWORD=local.password
MONGODB_DB=event_db
MONGODB_PORT=27017
MONGODB_HOST=mongo

JWT_SECRET=JWT_SECRET_1234567890
JWT_EXPIRATION=1h
```

#### event-server/.env
```text
MONGODB_USERNAME=root
MONGODB_PASSWORD=local.password
MONGODB_DB=event_db
MONGODB_PORT=27017
MONGODB_HOST=mongo
```

#### gateway-server/.env
```text
JWT_SECRET=JWT_SECRET_1234567890
JWT_EXPIRATION=1h
```

### mongo-init.sh
db에 간단하게 데이터를 넣어두는 용도의 스크립트 입니다.<br>
docker-compose.yaml 파일 중 volumes의
`- ./mongo-init.sh:/docker-entrypoint-initdb.d/mongo-init.sh` 부분에서 적용됩니다.
```sh
#!/bin/bash
mongosh -u root -p local.password --authenticationDatabase admin <<EOF
db = db.getSiblingDB("event_db");

db.createCollection("events");
db.createCollection("rewards");
db.createCollection("rewardrequests");
db.createCollection("useractions");

const userId = ObjectId();
const operatorId = ObjectId();
const eventId = ObjectId();
const rewardId = ObjectId();

// 이벤트 생성
db.events.insertOne({
  _id: eventId,
  name: "Level Reached Event", 
  description: "유저가 10레벨에 도달하면 보상 지급",
  conditionType: "level",
  conditionPayload: { amount: 10 },
  startAt: new Date("2025-05-01T00:00:00Z"),
  endAt: new Date("2025-06-01T00:00:00Z"),
  status: "ACTIVE",
  rewardIds: [rewardId],
  createdAt: new Date(),
  updatedAt: new Date()
});

// 보상 생성
db.rewards.insertOne({
  _id: rewardId,
  name: "500 Points",
  description: "레벨 달성 보상",
  type: "POINT",
  amount: 500,
  eventId: eventId,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 리워드 요청 생성
db.rewardrequests.insertOne({
  userId: userId,
  eventId: eventId,
  status: "PENDING",
  grantedAt: null,
  reason: null,
  requestedAt: new Date("2025-05-15T12:00:00Z")
});

// 유저 행동 로그 생성 (레벨 달성)
db.useractions.insertOne({
  userId: userId,
  type: "level_up",
  meta: { level: 12 },
  occurredAt: new Date("2025-05-15T10:00:00Z")
});
EOF
```

# curl 테스트 방법
* 각 서버는 서로 다른 포트: gateway 3000, auth 3001, event 3002
* `<이름>` 또는 `$대문자` 로 이루어진 부분은 해당 값에 맞는 값으로 변경해야 할 수 있습니다.

### 기본 세팅
```
GATEWAY=http://localhost:3000
PASSWORD=test1234
```
### 유저 등록
```
curl -X POST $GATEWAY/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com", "password":"test1234", "role":"USER"}'
curl -X POST $GATEWAY/auth/register -H "Content-Type: application/json" -d '{"email":"operator@example.com", "password":"test1234", "role":"OPERATOR"}'
curl -X POST $GATEWAY/auth/register -H "Content-Type: application/json" -d '{"email":"admin@example.com", "password":"test1234", "role":"ADMIN"}'
curl -X POST $GATEWAY/auth/register -H "Content-Type: application/json" -d '{"email":"auditor@example.com", "password":"test1234", "role":"AUDITOR"}'
```
#### 이메일 중복
```
curl -X POST $GATEWAY/auth/register -H "Content-Type: application/json" -d '{"email":"auditor@example.com", "password":"test1234", "role":"AUDITOR"}'
```
### 로그인 후 토큰 저장
```
USER_TOKEN=$(curl -s -X POST $GATEWAY/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com", "password":"test1234"}' | jq -r '.accessToken')
OPERATOR_TOKEN=$(curl -s -X POST $GATEWAY/auth/login -H "Content-Type: application/json" -d '{"email":"operator@example.com", "password":"test1234"}' | jq -r '.accessToken')
ADMIN_TOKEN=$(curl -s -X POST $GATEWAY/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com", "password":"test1234"}' | jq -r '.accessToken')
AUDITOR_TOKEN=$(curl -s -X POST $GATEWAY/auth/login -H "Content-Type: application/json" -d '{"email":"auditor@example.com", "password":"test1234"}' | jq -r '.accessToken')
```

### 유저 권한 바꿔보기
```
curl -X PUT $GATEWAY/auth/roleUpdate -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "<USERID>", "newRole": "ADMIN"}'
```
#### 권한 미달로 권한변경 실패
```
curl -X PUT $GATEWAY/auth/roleUpdate -H "Authorization: $AUDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "<USERID>", "newRole": "ADMIN"}'
```
### 이벤트 2개 생성
```
LEVEL10_EVENT_ID=$(curl -s -X POST $GATEWAY/event/create \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "레벨 10 이벤트",
    "description": "10레벨 달성 시 보상",
    "conditionType": "LEVEL",
    "conditionPayload": { "amount": 10 },
    "startAt": "2025-05-01T00:00:00Z",
    "endAt": "2025-06-01T00:00:00Z",
    "rewardIds": []
  }' | jq -r '._id')

LEVEL20_EVENT_ID=$(curl -s -X POST $GATEWAY/event/create \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "레벨 20 이벤트",
    "description": "20레벨 달성 시 보상",
    "conditionType": "LEVEL",
    "conditionPayload": { "amount": 20 },
    "startAt": "2025-05-01T00:00:00Z",
    "endAt": "2025-06-01T00:00:00Z",
    "rewardIds": []
  }' | jq -r '._id')
```
#### USER 권한으로 추가 시도 (실패)
```
curl -s -X POST $GATEWAY/event/create \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "레벨 30 이벤트",
    "description": "30레벨 달성 시 보상",
    "conditionType": "LEVEL",
    "conditionPayload": { "amount": 30 },
    "startAt": "2025-05-01T00:00:00Z",
    "endAt": "2025-06-01T00:00:00Z",
    "rewardIds": []
  }'
```
### 이벤트 조회
```
curl -X GET $GATEWAY/event -H "Authorization: Bearer $OPERATOR_TOKEN"
```
#### USER로 이벤트 조회 (실패)
```
curl -X GET $GATEWAY/event -H "Authorization: Bearer $USER_TOKEN"
```
#### id로 이벤트 조회
```
curl -X GET $GATEWAY/event/<USERID> -H "Authorization: Bearer $OPERATOR_TOKEN"
```
### 리워드 2개 생성
```
curl -s -X POST $GATEWAY/reward/create \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "100포인트",
    "description": "레벨10 보상",
    "type": "POINT",
    "amount": 100,
    "eventId": "'$LEVEL10_EVENT_ID'"
  }'

curl -s -X POST $GATEWAY/reward/create \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "200포인트",
    "description": "레벨20 보상",
    "type": "POINT",
    "amount": 200,
    "eventId": "'$LEVEL20_EVENT_ID'"
  }'
```
#### USER로 생성 (실패)
```
curl -s -X POST $GATEWAY/reward/create \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "300포인트",
    "description": "레벨30 보상",
    "type": "POINT",
    "amount": 100,
    "eventId": "'$LEVEL10_EVENT_ID'"
  }'
```
#### event id가 존재하지 않음 (실패)
```
curl -s -X POST $GATEWAY/reward/create \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "300포인트",
    "description": "레벨30 보상",
    "type": "POINT",
    "amount": 100,
    "eventId": "'$LEVEL30_EVENT_ID'"
  }'
```
## * userAction db에 조건 비교할 사항을 미리 넣어놔야함
### 유저 레벨 현황
```
use event_db
const user = db.users.findOne({ email: "user@example.com" })
db.useractions.insertOne({
  userId: user._id,
  type: "level_up",
  meta: { level: 15 },
  occurredAt: new Date()
})
```
### 유저의 보상 요청
#### REJECTED 예상 (레벨 10) 기본은 이벤트 비활성화 상태
```
curl -s -X POST $GATEWAY/reward/request \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "'$LEVEL10_EVENT_ID'"}' | jq
```
#### REJECTED 예상 (레벨 20) 이벤트 비활성화
```
curl -s -X POST $GATEWAY/reward/request \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "'$LEVEL20_EVENT_ID'"}' | jq
```
#### GRANTED 예상 이벤트 활성화 후 보상 요청
```
curl -X PUT $GATEWAY/event/update \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "$LEVEL10_EVENT_ID",
    "statusType": "ACTIVE"
  }'
```

### 보상 리스트 확인
```
curl -X GET $GATEWAY/reward/list -H "Authorization: Bearer $OPERATOR_TOKEN"
```

#### USER가 확인 (실패)
```
curl -X GET $GATEWAY/reward/list -H "Authorization: Bearer $USER_TOKEN"
```

### 보상 삭제
#### 없는 ID
```
curl -X DELETE $GATEWAY/reward/delete/000 -H "Authorization: Bearer $OPERATOR_TOKEN"
```

#### 정상 삭제
```
curl -X DELETE $GATEWAY/reward/delete/<REWARD_ID> -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 본인 요청 확인
```
curl -s -X GET $GATEWAY/reward/request/me \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### 전체 요청 확인
```
curl -s -X GET $GATEWAY/reward/request/all \
  -H "Authorization: Bearer $OPERATOR_TOKEN" | jq
```

### 전체 요청 확인 (필터링)
```
curl -s -G $GATEWAY/reward/request/all \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  --data-urlencode "eventId=$LEVEL10_EVENT_ID" \
  --data-urlencode "status=REJECTED"  | jq
```

### 전체 요청 확인 (필터링)
```
curl -X GET "$GATEWAY/reward/request/all?status=REJECTED" -H "Authorization: Bearer $AUDITOR_TOKEN"
```
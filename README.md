### KIOSK

### 포함된 항목
프로젝트 소스코드 전체

최종 보고서 파일

테스트용 APK 파일

### 테스트 APK 주의사항
업로드된 APK 파일은 테스트용 버전입니다.

실행 시 user_id 값을 고정하여 사용하고 있습니다.

이는 테스트 환경(App 전용) 에서만 적용되었으며,

실제 배포 버전에서는 user_id를 동적으로 받아야 합니다.

### 사용 기술 (Tech Stack)
Backend: Java, Spring Boot, MyBatis

Frontend: HTML5, CSS3, JavaScript

Database: MariaDB

Server 운영: Docker, Nginx

기타: FCM (Firebase Cloud Messaging), Git, FileZilla, Putty

### 주요 기능
KIOSK UI/UX 설계 및 구현

주문 메뉴 선택 및 결제 기능 (토스페이 연동)

결제 완료 후 영수증 조회 기능

재고 관리 및 발주 상태 관리 기능

관리자용 결제 내역 조회 및 필터링 기능

FCM을 통한 결제 완료 알림 기능

Docker 기반 서버 환경 구축 및 배포
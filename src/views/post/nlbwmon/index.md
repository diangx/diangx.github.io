---
title: "nlbwmon"
---

### * Description
Simple conntrack netlink based traffic accounting.

Linux 라우터에서 날짜별 네트워크 대역폭 사용량을 측정 및 기록해 주는 패키지

```
# Reference code
github.com/jow-/nlbwmon

# OpenWRT build defconfig
CONFIG_PACKAGE_nlbwmon=y
```

### * UCI Config 및 설명
```
config nlbwmon
    option netlink_buffer_size 524288     # Netlink(conntrack) 수신 버퍼 크기(바이트)
    option commit_interval 30s            # 메모리 → 디스크 커밋 주기
    option refresh_interval 30s           # 활성 연결 카운터 갱신 주기
    option database_compress '0'          # 데이터베이스 파일 gzip 압축 여부 (0: 미압축, 1: 압축)
    option database_directory /etc/nlbwmon # 데이터베이스 저장 디렉터리 경로
    option database_generations 7         # 보관할 데이터베이스 세대 수
    option database_limit 10000           # 한 파일당 저장할 최대 Flow(엔트리) 수 (0: 무제한)
    option protocol_database /usr/share/nlbwmon/protocols  # 포트·프로토콜 분류용 정의 파일 경로
    list local_network '172.30.1.0/24'    # 트래픽 계정 대상 로컬 네트워크 CIDR 목록
    list local_network 'lan'              # 트래픽 계정 대상 인터페이스 목록
```

### * Usage
```
# 네트워크 사용시 uci database_directory 에 db 기록
root@:/etc/nlbwmon# ls -al
drwxr-xr-x    2 root     root           448 Jul 16 10:48 .
drwxr-xr-x    1 root     root          2232 Jul 15 17:13 ..
-rw-r-----    1 root     root           184 Jul 15 21:47 20250709.db
-rw-r-----    1 root     root           400 Jul 16 10:48 20250710.db
-rw-r-----    1 root     root          3856 Jul 16 00:00 20250715.db
-rw-r-----    1 root     root           328 Jul 16 10:52 20250716.db

# db 파일 조회 방법
root@:/etc/nlbwmon# nlbw -c csv -g mac,ip -q -t 2025-07-15
mac     ip      conns   rx_bytes        rx_pkts tx_bytes        tx_pkts
42:0c:af:a4:05:7b       172.30.1.42     3671    58966158        53118   4353622 20659
a0:ce:c8:c7:e9:89       172.30.1.14     16340   54393598        73596   13959633        55981
92:29:a4:aa:6a:ec       172.30.1.4      6972    40241302        40482   6430071 32270
38:f3:ab:38:a9:2b       172.30.1.47     2147    274882  852     214019  1448
92:29:a4:aa:6a:ec       2001:470:ffd0:4:6020:b79d:88ea:8282     24      39246   70      35960   81
34:02:86:87:ef:61       172.30.1.6      157     13787   73      6904    93
98:39:10:82:64:9c       172.30.1.254    894     9266    157     5440    170
98:39:10:82:64:9c       2001:470:ffd0:4::1      2       272     2       158     2
00:00:00:00:00:00       172.30.1.128    11      212     4       0       0
98:39:10:82:64:9c       fd1c:3431:1273::1       2       0       0       158     2
```

### * Debug
```
# 기본적으로 네트워크가 정상 동작할 때 프로세스가 동작함 (hotplug)
root@:/etc/nlbwmon# ps -ef | grep nlbwmon
root     16604     1  0 10:48 ?        00:00:00 /usr/sbin/nlbwmon -o /etc/nlbwmon -b 524288 -i 30s -r 30s -p /usr/share/nlbwmon/protocols -G 7 -I 2025-07-17/7 -L 10000 -s 172.30.1.0/24 -s 172.30.1.254/24 -s 2001:470:ffd0:4::1/62 -s fd1c:3431:1273::1/60

# 특정 인터페이스 사용량 만들기
# en6 interface 100MB 생성 명령어
kimjiwan@mini ~ % curl --interface en6 -o /dev/null http://ipv4.download.thinkbroadband.com/100MB.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  100M  100  100M    0     0   481k      0  0:03:32  0:03:32 --:--:--  556k
```

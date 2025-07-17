---
title: "git command"
---


### * 수정내용 조회
```
git diff <파일경로>
```


### * 특정 리비전으로 브랜치 되돌리기
```
# 해당 리비전으로 되돌림 pull 시 다시 최신화 됨
git reset --hard <리비전>
# (주의) 브랜치에 해당 리비전으로 강제 원복
git push --force
```


### * 다른 브랜치 코드가져와서 현재 브랜치에 넣기
```
# origin 에 있는 master 브랜치만 로컬에 가져와서 master 라는 이름으로 만듬
git fetch origin master:master

# master 브랜치 커밋 해쉬 확인
git log master --oneline

# 이미 현재 브랜치 위에 있다면 건너뜀
git checkout <현재 브랜치>

# 원하는 커밋 가져오기 (master로 부터)
git cherry-pick <커밋해쉬>
```


### * git log 정리
```
# 각 커밋의 diff 결과 출력. -10 은 최근 10개의 커밋에 대한 정보를 의미
git log -p -10

# 시간 기준 커밋
git log --since=1.weeks
git log --since="1 years 2 day 3 minutes ago"

git log --after=1.weeks
git log --after="1 years 2 day 3 minutes ago"

# 로그 출력 내용 정의
git log --stat
git log --pretty=oneline
git log --pretty=format:"%h - %an, %ar : %s"

%H : 커밋 해쉬 / %h : 짧은 커밋 해쉬 / %T & %t : 트리 해쉬 / %P or %p : 부모 해쉬 / %an : 이름 / %ae : 이메일 / %ad : 시간 ...

# 로그 그래프
git log --graph
```
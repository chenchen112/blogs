# git

## git 常用命令

- git fetch
- git pull
- git merge origin/dev(git rebase)
- git reset .
- git add .
- git commit -m "second commit"
- git push

- git stash
- git stash pop
- git restore .

- git revert HEAD  反转上个 commit
- git revert HEAD^ 反转上上个 commit
- git revert <commit-id>  反转指定 commit
>本地文件回到之前，提交后会有一个新的 revert commit 来抵消之前所有 commit

- git reset HEAD 无变化
- git reset HEAD^ --mixed 默认方式，工作区代码不变化，暂存区和本地仓库发生回退
- git reset HEAD^ --soft 工作区和暂存区不变化，本地仓库发生回退
- git reset HEAD^ --hard 工作区代码，暂存区和本地仓库均发生回退
>此时需要 push -f 才能推送，后续的 commit 会被删掉

- git status
- git log
- git remote
- git config -l
- git checkout -b <new-branch-name>

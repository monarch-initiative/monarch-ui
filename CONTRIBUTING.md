## Contributing to the monarch-ui

Thanks for helping make this project better. The [README QuickStart](README) provides easy instructions for someone who wants to *evaluate* the monarch-ui by quickly building and testing it.

This document is oriented towards *contributors* who wish to improve the source code, make suggestions, report bugs, improve documentation, or otherwise help make the Monarch Initiative UI better or more useful. The monarch-ui project currently uses a form of [GitHub Flow](http://guides.github.com/overviews/flow/) to accept source code modifications via pull requests from a *forked* repo.

Because we hope that non-developers can also contribute improvements to the monarch-ui and its content, we've written very detailed and explicit instructions about how to submit code. But at a high-level, it is the basic [GitHub Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow):

- Fork Repo
- Create Branch in Forked Repo
- Improve Code in Forked Repo Branch
- Submit Pull Request from Forked Repo Branch


## Table of contents

<!-- MarkdownTOC -->

- [Basic principles of the Monarch-flavored GitHub Flow](#basic-principles-of-the-monarch-flavored-github-flow)
    - [Principle 1: Work from a personal fork](#principle-1-work-from-a-personal-fork)
    - [Principle 2: Commit to personal branches of that fork](#principle-2-commit-to-personal-branches-of-that-fork)
    - [Principle 3: Propose changes via pull request of personal branches](#principle-3-propose-changes-via-pull-request-of-personal-branches)
    - [Principle 4: Delete or ignore stale branches, but don't recycle merged ones](#principle-4-delete-or-ignore-stale-branches-but-dont-recycle-merged-ones)
- [One Time Setup - Forking a Shared Repo](#one-time-setup---forking-a-shared-repo)
    - [Step 1 - Fork `monarch-ui` via the Web](#step-1---fork-monarch-ui-via-the-web)
    - [Step 2 - Clone the Fork Locally](#step-2---clone-the-fork-locally)
    - [Step 3 - Configure the local forked repo](#step-3---configure-the-local-forked-repo)
    - [Step 4 - Configure  `.bashrc` to show current branch \(optional\)](#step-4---configure-bashrc-to-show-current-branch-optional)
- [Typical Development Cycle](#typical-development-cycle)
    - [Refresh and clean up local environment](#refresh-and-clean-up-local-environment)
        - [Step 1 - Fetch remotes](#step-1---fetch-remotes)
        - [Step 2 - Ensure that 'master' is up to date](#step-2---ensure-that-master-is-up-to-date)
    - [Create a new branch](#create-a-new-branch)
    - [Changes, Commits and Pushes](#changes-commits-and-pushes)
    - [Preparing to create Pull Request](#preparing-to-create-pull-request)
    - [Reconcile branch with upstream changes](#reconcile-branch-with-upstream-changes)
        - [Fetching the upstream branch](#fetching-the-upstream-branch)
        - [Rebasing to avoid Conflicts and Merge Commits](#rebasing-to-avoid-conflicts-and-merge-commits)
        - [Dealing with merge conflicts during rebase](#dealing-with-merge-conflicts-during-rebase)
        - [Advanced: Interactive rebase](#advanced-interactive-rebase)
    - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Reviewing a Pull Request](#reviewing-a-pull-request)
    - [Respond to CI tests \(Not Yet Implemented\)](#respond-to-ci-tests-not-yet-implemented)
    - [Respond to peer review](#respond-to-peer-review)
    - [Merge a Pull Request](#merge-a-pull-request)
    - [Celebrate and get back to work](#celebrate-and-get-back-to-work)
- [Appendices](#appendices)
    - [References and Documentation](#references-and-documentation)
    - [Installing NodeJS](#installing-nodejs)
        - [Mac users without `homebrew`](#mac-users-without-homebrew)
        - [Mac users with `homebrew`](#mac-users-with-homebrew)
            - [Troubleshooting the Homebrew install](#troubleshooting-the-homebrew-install)
        - [Install `nvm` - Node Version Manager](#install-nvm---node-version-manager)
        - [Easy Install of `nvm` via `homebrew` on Mac](#easy-install-of-nvm-via-homebrew-on-mac)
    - [Update to NodeJS v8.12.0 using `nvm`](#update-to-nodejs-v8120-using-nvm)
    - [Determining your current version](#determining-your-current-version)

<!-- /MarkdownTOC -->




### Basic principles of the Monarch-flavored [GitHub Flow](http://guides.github.com/overviews/flow/)

- *Note to experienced GitHub users*: These instructions are very explicit as they are designed to introduce potential GitHub novices to the processes of managing forked repos and pull requests. Feel free to skip ahead to:

- [Submitting a Pull Request](#submitting-a-pull-request)


#### Principle 1: Work from a personal fork

* Prior to adopting the workflow, a developer will perform a *one-time setup* to create a personal Fork of the appropriate shared repo (e.g., `monarch-ui`) and will subsequently perform their development and testing on a task-specific branch within their forked repo. This forked repo will be associated with that developer's GitHub account, and is distinct from the shared repo managed by the Monarch Initiative.

#### Principle 2: Commit to personal branches of that fork

* Changes will never be committed directly to the master branch on the shared repo. Rather, they will be composed as branches within the developer's forked repo, where the developer can iterate and refine their code prior to submitting it for review.

#### Principle 3: Propose changes via pull request of personal branches

*  Each set of changes will be developed as a task-specific *branch* in the developer's forked repo, and then a [pull request](github.com/government/best-practices/compare) will be created to propose changes to the shared repo. This mechanism provides a way for developers to discuss, revise and ultimately merge changes from the forked repo into the shared Monarch repo.

#### Principle 4: Delete or ignore stale branches, but don't recycle merged ones
*  Once a pull request has been merged, the task-specific branch is no longer needed and may be deleted or ignored. It is bad practice to reuse an existing branch once it has been merged. Instead, a new branch and pull-request cycle should begin when a developer switches to a different coding task.
*  You may create a pull request in order to get feedback, but if you wish to continue working on the branch, please title the pull request with "DO NOT MERGE YET".


### One Time Setup - Forking a Shared Repo

The official shared Monarch repositories (e.g., `monarch-ui`) are intended to be modified solely via pull requests that are reviewed and merged by a set of responsible 'gatekeeper' developers within the Monarch development team. These pull requests are initially created as task-specific named branches within a developer's personal forked repo.

Typically, a developer will fork a shared repo once, which creates a personal copy of the repo that is associated with the developer's GitHub account. Subsequent pull requests are developed as branches within this personal forked repo. The repo need never be forked again, although each pull request will be based upon a new named branch within this forked repo.

#### Step 1 - Fork `monarch-ui` via the Web

The easiest way to fork the `monarch-ui` repository is via the GitHub web interface:

- Ensure you are logged into GitHub.
- Navigate to the monarch-ui shared repo at [https://github.com/monarch-initiative/monarch-ui](https://github.com/monarch-initiative/monarch-ui).
- Notice the 'Fork' button in the upper right corner. It has a number to the right of the button.
- Click the Fork button. The resulting behavior will depend upon whether your GitHub account is a member of a GitHub organization. If not a member of an organization, then the fork operation will be performed and the forked repo will be created in your account.
- If you are a member of an organization (e.g., monarch-initiative or acme-incorporated), then GitHub will present a dialog to allow you to choose where to place the forked repo. Click on the icon corresponding to your username.
- *If you accidentally click the number, you will be on the Network Graphs page and should go back.*

#### Step 2 - Clone the Fork Locally

At this point, you will have a fork of the shared repo (e.g., monarch-ui) stored within GitHub, but it is not yet available on your local development machine. This is done as follows:

    # Assumes that directory ~/MI/ will contain your Monarch repos.
    # Assumes that your username is MarieCurie.
    # Adapt these instructions to suit your environment
    > cd ~/MI
    > git clone git@github.com:MarieCurie/monarch-ui.git
    > cd monarch-ui

Notice that we are using the SSH transport to clone this repo, rather than the HTTPS transport. The telltale indicator of this is the `git@github.com:MarieCurie...` rather than the alternative `https://github.com/MarieCurie...`.

*Note: If you encounter difficulties with the above `git clone`, you may need to associate your local public SSH key with your GitHub account. See [Which remote URL should I use?](https://help.github.com/articles/which-remote-url-should-i-use/) for information.*

#### Step 3 - Configure the local forked repo

The `git clone` above copied the forked repo locally, and configured the symbolic name 'origin' to point back to the *remote* GitHub fork. We will need to create an additional *remote* name to point back to the shared version of the repo (the one that we forked in Step 2). The following should work:

    # Assumes that you are already in the local monarch-ui directory
    > git remote add upstream https://github.com/monarch-initiative/monarch-ui.git

Verify that remotes are configured correctly by using the command `git remote -v`. The output should resemble:


    upstream    https://github.com/monarch-initiative/monarch-ui.git (fetch)
    upstream    https://github.com/monarch-initiative/monarch-ui.git (push)
    origin  git@github.com:MarieCurie/monarch-ui.git (fetch)
    origin  git@github.com:MarieCurie/monarch-ui.git (push)


#### Step 4 - Configure  `.bashrc` to show current branch (optional)

One of the important things when using Git is to know what branch your working directory is tracking. This can be easily done with the `git status` command, but checking your branch periodically can get tedious. It is easy to configure your `bash` environment so that your current git branch is always displayed in your bash prompt.

If you want to try this out, add the following to your `~/.bashrc` file:

    function parse_git_branch()
    {
      git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ \1/'
    }
    LIGHT_GRAYBG="\[\033[0;47m\]"
    LIGHT_PURPLE="\[\033[0;35m\]"
    NO_COLOR="\[\033[0m\]"
    export PS1="$LIGHT_PURPLE\w$LIGHT_GRAYBG\$(parse_git_branch)$NO_COLOR \$ "

You will need to open up a new Terminal window (or re-login to your existing terminal) to see the effect of the above `.bashrc` changes.

If you cd to a git working directory, the branch will be displayed in the prompt. For example:

    ~ $
    ~ $ # This isn't a git directory, so no branch is shown
    ~ $
    ~ $ cd /tmp
    /tmp $
    /tmp $ # This isn't a git directory, so no branch is shown
    /tmp $
    /tmp $ cd ~/MI/monarch-ui/
    ~/MI/monarch-ui fix-feedback-button $
    ~/MI/monarch-ui fix-feedback-button $ # The current branch is shown
    ~/MI/monarch-ui fix-feedback-button $
    ~/MI/monarch-ui fix-feedback-button $ git status
    On branch fix-feedback-button
    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git checkout -- <file>..." to discard changes in working directory)
        ... remaining output of git status elided ...

---

### Typical Development Cycle

Once you have completed the One-time Setup above, then it will be possible to create new branches and pull requests using the instructions below. The typical development cycle will have the following phases:

- Refresh and clean up local environment
- Create a new task-specific branch
- Perform development work, periodically committing to the branch
- Prepare and submit a Pull Request (PR) that refers to the branch
- Participate in PR Review, possibly making changes and pushing new commits to the branch
- Celebrate when your PR is finally Merged into the shared repo.
- Move onto the next task and repeat this cycle


#### Refresh and clean up local environment

Git will not automatically sync your Forked repo with the original shared repo, and will not automatically update your local copy of the Forked repo. These tasks are part of the developer's normal *cycle*, and should be the first thing done prior to beginning a new development effort and creating a new branch.

##### Step 1 - Fetch remotes

In the (likely) event that the *upstream* repo (the monarch-ui shared repo) has changed since the developer last began a task, it is important to update the local copy of the upstream repo so that its changes can be incorporated into subsequent development.

    > git fetch upstream        # Updates the local copy of shared repo BUT does not affect the working directory, it simply makes the upstream code available locally for subsequent Git operations. See step 2.

##### Step 2 - Ensure that 'master' is up to date

Assuming that new development begins with branch 'master' (a good practice), then we want to make sure our local 'master' has all the recent changes from 'upstream'. This can be done as follows:

    > git checkout master
    > git reset --hard upstream/master

The above command is potentially dangerous if you are not paying attention, as it will remove any local commits to master (which you should not have) as well as any changes to local files that are also in the upstream/master version (which you should not have). In other words, the above command ensures a proper clean slate where your local master branch is identical to the upstream master branch.

Some people advocate the use of `git merge upstream/master` or `git rebase upstream/master` instead of the `git reset --hard`. One risk of these options is that unintended local changes accumulate in the branch and end up in an eventual pull request. Basically, it leaves open the possibility that a developer is not really branching from upstream/master, but is branching from some developer-specific branch point.


#### Create a new branch

Once you have updated the local copy of the master branch of your forked repo, you can create a named branch from this copy and begin to work on your code and pull-request. This is done with:

    > git checkout -b fix-feedback-button   # This is an example name

This will create a local branch called 'fix-feedback-button' and will configure your working directory to track that branch instead of 'master'.

You may now freely make modifications and improvements and these changes will be accumulated into the new branch when you commit.

If you followed the instructions in [Step 5 - Configure  `.bashrc` to show current branch (optional)](#step-5---configure--bashrc-to-show-current-branch-optional), your shell prompt should look something like this:

    ~/MI/monarch-ui fix-feedback-button $

#### Changes, Commits and Pushes

Once you are in your working directory on a named branch, you make changes as normal. When you make a commit, you will be committing to the named branch by default, and not to master.

You may wish to periodically `git push` your code to GitHub. Note the use of an explicit branch name that matches the branch you are on (this may not be necessary; a git expert may know better):

    > git push origin fix-feedback-button   # This is an example name

Note that we are pushing to 'origin', which is our forked repo. We are definitely NOT pushing to the shared 'upstream' remote, for which we will usually not have permission to push.

#### Preparing to create Pull Request

Once you are satisfied that your changes are ready to submit as a Pull Request, please ensure that the code passes Testing and Linting as described here:

- [Linting](README#linting)
- [Testing](README#testing)

#### Reconcile branch with upstream changes

If you have followed the instructions above at [Refresh and clean up local environment](#refresh-and-clean-up-local-environment), then your working directory and task-specific branch will be based on a starting point from the latest-and-greatest version of the shared repo's master branch. Depending on how long it takes you to develop your changes, and how much other developer activity there is, it is possible that changes to the upstream master will conflict with changes in your branch.

It is therefore good practice to periodically pull down these upstream changes and reconcile your task branch with the upstream master branch. At the least, this should be performed prior to submitting a PR.

##### Fetching the upstream branch

The first step is to fetch the update upstream master branch down to your local development machine. Note that this command will NOT affect your working directory, but will simply make the upstream master branch available in your local Git environment.

    > git fetch upstream

##### Rebasing to avoid Conflicts and Merge Commits

Now that you've fetched the upstream changes to your local Git environment, you will use the `git rebase` command to adjust your branch:


    > # Make that your changes are committed to your branch
    > # before doing any rebase operations
    > git status
        # ... Review the git status output to ensure your changes are committed
        # ... Also a good chance to double-check that you are on your
        # ... task branch and not accidentally on master
    > git rebase upstream/master

The rebase command will have the effect of adjusting your commit history so that your task branch changes appear to be based upon the most recently fetched master branch, rather than the older version of master you may have used when you began your task branch.

By periodically rebasing in this way, you can ensure that your changes are in sync with the rest of Monarch development and you can avoid hassles with merge conflicts during the PR process.


##### Dealing with merge conflicts during rebase

Sometimes conflicts happen where another developer has made changes and committed them to the upstream master (ideally via a successful PR) and some of those changes overlap with the code you are working on in your branch. The `git rebase` command will detect these conflicts and will give you an opportunity to fix them before continuing the rebase operation. The Git instructions during rebase should be sufficient to understand what to do, but a very verbose explanation can be found at [Rebasing Step-by-Step](http://gitforteams.com/resources/rebasing.html)

##### Advanced: Interactive rebase

As you gain more confidence in Git and this workflow, you may want to create PRs that are easier to review and best reflect the intent of your code changes. One technique that is helpful is to use the *interactive rebase* capability of Git to help you clean up your branch prior to submitting it as a PR. This is completely optional for novice Git users, but it does produce a nicer shared commit history.

See [squashing commits with rebase](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html) for a good explanation.


#### Submitting a Pull Request

Once you have developed code and are confident it is ready for review and final integration into the upstream version, you will want to do a final `git push origin ...` (see Changes, Commits and Pushes above). Then you will use the GitHub website to create a Pull Request based upon the newly pushed branch.

See [submitting a pull request](https://help.github.com/articles/creating-a-pull-request).


#### Reviewing a Pull Request

The set of open PRs for the monarch-ui repo can be viewed by first visiting the shared monarch-ui GitHub page at [https://github.com/monarch-initiative/monarch-ui](https://github.com/monarch-initiative/monarch-ui).

Click on the 'Pull Requests' link on the right-side of the page.

Note that the Pull Request you created from your forked repo shows up in the shared repo's PR list. You can think of the shared repo's PR list as a queue of changes to be applied, pending their review and approval.

#### Respond to CI tests (Not Yet Implemented)

The GitHub Pull Request mechanism is designed to allow testing, review and refinement of code prior to its final merge to the shared repo. After creating your PR, the CI (Continuous Integration) system tests for monarch-ui will be executed automatically, ensuring that the code that 'worked fine' on your development machine also works in the production-like environment provided by the CI system. The current status of the tests can be found near the bottom of the individual PR page, to the right of the Merge Request symbol.

*As of this writing (June, 2019) monarch-ui does not currently utilize a CI system*.

#### Respond to peer review

It's likely that after you create a Pull Request, you will receive useful peer review or perhaps your TravisCI tests will have failed. In either case, you will make the required changes on your development machine, retest your changes, and you can then push your new changes back to your task branch and the PR will be automatically updated. This allows a PR to evolve in response to feedback from peers. Once everyone is satisfied, the PR may be merged. (see below).


#### Merge a Pull Request

One of the goals behind the workflow described here is to enable a large group of developers to meaningfully contribute to the Monarch codebase. The Pull Request mechanism encourages review and refinement of the proposed code changes. As a matter of informal policy, Monarch expects that a PR will not be merged by its author and that a PR will not be merged without at least one reviewer approving it (via a comment such as "+1" (meaning "looks good") in the PR's Comment section).

#### Celebrate and get back to work

You have successfully gotten your code improvements into the shared repository. Congratulations! The branch you created for this PR is no longer useful, and may be deleted from your forked repo or may be kept. But in no case should the branch be further developed or reused once it has been successfully merged. Subsequent development should be on a new branch. Prepare for your next work phase by returning to [Refresh and clean up local environment](#refresh-and-clean-up-local-environment).


### Appendices

#### References and Documentation

- The instructions presented here are derived from several sources. However, a very readable and complete article is [Using the Fork-and-Branch Git Workflow](http://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/). Note that the article doesn't make clear that certain steps like Forking are one-time setup steps, after which Branch / Pull Request / Merge steps are used.
- Another useful resource describing forking and branching is https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow.
- New to GitHub? The [GitHub Guides](http://guides.github.com) are a great place to start.


#### Installing NodeJS

There is some *one-time* setup that needs to be completed before you can build and develop the application. Most of this is involved with ensuring that you have a compatible version of NodeJS installed.

The existing application is buildable with v8.12.0, so these instructions will encourage the use of that version until further notice. It *might* be possible to build with earlier or later versions of NodeJS, but that has not been tested and these instructions are intended to be mostly foolproof.

##### Mac users without `homebrew`

If you don't have [homebrew](https://brew.sh) installed, you should install it.

##### Mac users with `homebrew`

If you have `homebrew` installed, but haven't run it in a while, you should update it with:

- `brew update`
- `brew upgrade`

###### Troubleshooting the Homebrew install

If the above update/upgrade instructions do not work, it may mean that you have upgraded MacOSX to High Sierra or beyond, and the older version of homebrew isn't able to auto-update itself. MacOSX High Sierra and beyond have modified the default security settings and file permissions so that older versions of `homebrew` may not work correctly and may not even update. If this appears to have happened to you, you will need to uninstall the old version and install the latest `homebrew`. See [FAQ](https://docs.brew.sh/FAQ) and search for 'How do I uninstall Homebrew?', which says that you should uninstall via the following:

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

##### Install `nvm` - Node Version Manager

[nvm - Node Version Manager](https://github.com/creationix/nvm) is used to ensure that you are running the correct version of NodeJS. The instructions at [Installation](https://github.com/creationix/nvm#installation) should be sufficient for Mac/Unix. Mac users can alternatively use `homebrew` as described below).

##### Easy Install of `nvm` via `homebrew` on Mac

You can use `brew install nvm` to install `nvm`, saving yourself a lot of hassle if it works right. See [How to install NVM (Node Version Manager) with Homebrew](https://www.wdiaz.org/how-to-install-nvm-with-homebrew/).

After installing `nvm`, you will need to modify your `.bashrc` or `.bash_profile` as per the instructions linked above. The most important part of those instructions is likely the addition of the following to your `.bashrc` or `.bash_profile`:

```bash
export NVM_DIR="$HOME/.nvm"
. "$(brew --prefix nvm)/nvm.sh"
```

We recommend exiting your terminal session and starting a new one, to verify that `nvm` is properly installed with:

```bash
nvm
```

which should print the Node Version Manager help text to the terminal.


#### Update to NodeJS v8.12.0 using `nvm`

Now we can use `nvm` to install and select a specific version of NodeJS. We are currently supporting NodeJS v8.12.0. The default NodeJS installation may be an earlier or later version, which is why we use `nvm`:

- `nvm install v8.12.0`
- `nvm use v8.12.0`

By default, you will need to type `nvm use v8.12.0` before any development session, which can become tedious and error-prone. It may be convenient to set v8.12.0 as your default with the command:

```bash
nvm alias default 8.12.0
```

#### Determining your current version

```bash
~ $ nvm current
v8.12.0
```

# Contributing

Thank you for considering contributing to Heetch's open source web projects! At Heetch we strongly believe in shared knowledge, so that means a lot to us. 

## Why should you read and follow these guidelines?

Following these guidelines helps to communicate that you respect the time of the developers managing and developing these open source projects. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## What kind of contributions could you make?

There are a lot of ways one can contribute to an open source project. From bug reporting, to ideas of improvements, up to concrete changes or additions submitted as a pull request, all contributions are valuable!

### Reporting bugs

Did you find a bug in a project? Please [create an issue](https://github.com/heetch/web-tools/issues/new) to report it.  

Don't forget to specify on which project the bug happens, to explain how to reproduce it, and consider providing screenshots if the bug is visible on screen. 

### Questions, ideas, feature requests

You can also [create an issue](https://github.com/heetch/web-tools/issues/new) labelled `enhancement` or `question` to share your thoughts with us. 

### Make changes or add new features

By following the guidelines below, you can contribute by proposing some code changes. Please [create an issue](https://github.com/heetch/web-tools/issues/new) for the changes you are envisioning, and refer to it in your pull request. 

## Getting started

### Fork and create a branch

Start by [forking this repository](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name. For instance, assuming you are working on issue #123, you could name your branch `123-add-color-picker-field`.

### Get the tests running

After installing dependencies with `yarn install`, you should be able to run tests locally with `yarn nx test <project>` (e.g. `yarn nx test react-forms`).

### Implement your fix or feature

At this point, you're ready to make your changes! Just make sure to stick to the style and assumptions of the project you are contributing to. For example, `react-forms` fields components are built on top of [@heetch/flamingo-react](https://www.npmjs.com/package/@heetch/flamingo-react), so all contributions are expected to keep it this way. 

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with `heetch/web-tools`'s master branch:

```sh
git remote add upstream git@github.com:heetch/web-tools.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 123-add-color-picker-field
git rebase master
git push --set-upstream origin 123-add-color-picker-field
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request).

Github Actions will run our test suite. We care about quality, so your PR won't be merged until all tests pass.

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good](http://git-scm.com/book/en/Git-Branching-Rebasing)
[resources](https://help.github.com/en/github/using-git/about-git-rebase) but here's the suggested workflow:

```sh
git checkout 123-add-color-picker-field
git pull --rebase upstream master
git push --force-with-lease 123-add-color-picker-field
```

### Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

* It is passing CI.
* It has been approved by at least two maintainers. If it was a maintainer who
  opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are
met.

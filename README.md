# The web-tools library has been archived and is no longer under active maintenance.

# Heetch's Web Tools

This monorepo, powered by [Nx](https://nx.dev), is home of open source web projects created at [Heetch](https://www.heetch.com/).

At Heetch, we try to constantly improve the quality and usability of our tech stack.
As we strongly believe in knowledge sharing, when some piece of software is not too specific to our internals, we plan to share it with the community as an open source project.
This is the purpose of this repository. 

## Projects structure

We currently have 1 package inside this repository: 

- `react-forms`: a React library to build forms based on a configuration schema, powered by [Flamingo](https://www.npmjs.com/package/@heetch/flamingo-react) components. 

## How to install and execute

> **Important!** The node version for the project is 16.11. Make sure you have that version installed on your computer. If you have NVM installed, run `nvm use 16.11`. If not, install it here: https://github.com/creationix/nvm#install-script

1. Clone this repository locally `$ git clone https://github.com/heetch/web-tools.git`
2. Install the dependencies. Inside the root `$ yarn install`
3. Run one of the packages in dev mode: the actual command might depend on the package's nature. See specific instructions below.

### Dev mode commands per package

#### `react-forms`

This package being a library of components, it's dev mode relies on [StoryBook](https://storybook.js.org/docs/react/get-started/introduction).
In order to work on `react-forms`, run this command: `$ yarn nx storybook react-forms`. A shortcut has also been added: `$ yarn react-forms:storybook`. 

## Contributing

If you intend to contribute to this repository, please read our [contribution guide](https://github.com/heetch/web-tools/blob/master/CONTRIBUTING.md). 
We also expect you to adhere to our [code of conduct](https://github.com/heetch/web-tools/blob/master/CODE_OF_CONDUCT.md). 

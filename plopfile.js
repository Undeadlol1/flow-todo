// Docs: https://plopjs.com/documentation
module.exports = function (plop) {
    /**
     * React dumb component generator.
     */
    plop.setGenerator('dumb component', {
        description: 'A Dumb Component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'component name please',
            },
        ],
        actions: [
            // Create component file.
            {
                type: 'add',
                templateFile: 'templates/DumbComponent.txt',
                path: './src/components/unsorted/{{pascalCase name}}/{{pascalCase name}}.tsx',
            },
            // Create storybook file.
            {
                type: 'add',
                templateFile: 'templates/DumbComponent.stories.txt',
                path: './src/components/unsorted/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
            },
            // Create index file.
            {
                type: 'add',
                templateFile: 'templates/DumbComponent.index.txt',
                path: './src/components/unsorted/{{pascalCase name}}/index.ts',
            },
        ],
    });
};

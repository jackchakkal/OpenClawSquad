/**
 * OpenClawSquad - Interactive Prompts
 */

import inquirer from 'inquirer';

export function createPrompt() {
  // Override inquirer to add some enhancements
  const originalPrompt = inquirer.prompt;
  
  return {
    async ask(question) {
      const { answer } = await inquirer.prompt([{
        type: 'input',
        name: 'answer',
        message: question,
        prefix: '  ❓'
      }]);
      return answer;
    },

    async choose(question, choices) {
      const { choice } = await inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: question,
        prefix: '  ❓',
        choices: choices.map(c => ({
          name: c.label || c.name || c,
          value: c.value || c
        }))
      }]);
      return choices.find(c => (c.value || c) === choice);
    },

    async confirm(question) {
      const { answer } = await inquirer.prompt([{
        type: 'confirm',
        name: 'answer',
        message: question,
        prefix: '  ❓',
        default: true
      }]);
      return answer;
    },

    async multiChoose(question, choices) {
      const { selected } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'selected',
        message: question,
        prefix: '  ❓',
        choices: choices.map(c => ({
          name: c.label || c.name || c,
          value: c.value || c,
          checked: c.checked || false
        }))
      }]);
      return selected;
    },

    async password(question) {
      const { answer } = await inquirer.prompt([{
        type: 'password',
        name: 'answer',
        message: question,
        prefix: '  🔐'
      }]);
      return answer;
    },

    close() {
      // inquirer doesn't need explicit cleanup
    }
  };
}

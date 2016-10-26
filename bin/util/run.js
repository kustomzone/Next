import prompt from './prompt';
import detect from 'detect-port';
import chalk from 'chalk';

export default async function run(srv, desiredPort) {
  const port = await detect(desiredPort);
  if (port !== desiredPort) {
    const question = chalk.red(`Something is already running at port ${desiredPort}.\n` +
      `Would you like to run the app on port ${port} instead? [Y/n]`);
    const answer = await prompt(question);
    const shouldChangePort = (answer.length === 0 || answer.match(/^yes|y$/i));
    if (!shouldChangePort) {
      console.log(chalk.red('Exiting.'));
      process.exit(0);
    }
  }
  await srv.start(port);
  console.log(`Ready on ${chalk.cyan(`http://localhost:${port}`)}`);
}

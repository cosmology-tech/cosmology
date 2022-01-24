import { prompt } from '../utils';

export default async (argv) => {

    const answers = await prompt([
        { type: 'number', name: 'length', message: 'length', default: 12 },
    { 
            type: 'fuzzy',
            name: 'stuff',
            message: 'pick something',
            choices: ['atom', 'cosmos', 'akash', 'yolo', 'boom']
        }],
        argv
    );

    console.log(answers);
};

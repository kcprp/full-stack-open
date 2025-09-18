interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number}


const calculateExercies = (exercises: number[], target: number): Result => {
    if (exercises.length === 0) throw new Error('No exercises provided');
    if (target <= 0) throw new Error('Target must be positive');
    if (exercises.some(exercise => exercise < 0)) throw new Error('Exercises must be positive');
    
    const average = exercises.reduce((a, b) => a + b, 0) / exercises.length;
    const periodLength = exercises.length;
    const trainingDays = exercises.filter(exercise => exercise > 0).length;
    const success = average >= target;
    const rating = success ? 3 : average >= target / 2 ? 2 : 1;
    const ratingDescription = success ? 'You did it! You reached your target.' : average >= target / 2 ? 'Not too bad but could be better' : 'You can do better';
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
    if (process.argv.length < 4) throw new Error('Not enough arguments');
    const target = Number(process.argv[2]);
    const exercises = process.argv.slice(3).map(Number);
    console.log(calculateExercies(exercises, target));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}
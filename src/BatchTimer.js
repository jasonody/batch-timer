let tasks = {};
let taskId = 0;

export class BatchTimer {
	
	static addTask(task, interval) {
		
		taskId = taskId + 1
		
		tasks[taskId] = {
			operation: task,
			interval,
			nextRun: +new Date() + interval
		};
		
		return () => { delete tasks[taskId]; }
	}
}
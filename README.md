# batch-timer
A global batch timer to relieve timer congestion issues in web-browsers.

## Usage

### BatchTimer.addTask(function task, timeout, options)
Adds a task to the batch timer's queue. If a timeout of 0 is supplied, the task will be executed during the next cycle.

	BatchTimer.addTask(function () { 
	
		/* Your work goes here */ 
	}, 100, { /* options */});
	
#### Options

**reoccuring**  
Type: `Boolean` Default: `false`

Indicates that the task is to be scheduled to run on a reoccuring basis.

**retryOnFailure**  
Type: `Boolean` Default: `false`

Indicates that a task should be re-executed again during the next cycle if it fails. If it fails again, it will be removed and no longer scheduled for execution.

**retryThreshold**  
Type: `Boolean` Default: `0`

The number of times a failed task will be scheduled for re-execution during the next cycle before it will be removed and no longer scheduled.

### BatchTimer.count()
Returns the number of tasks in the queue.

### BatchTimer.reset()
Clears all the tasks that have been registered with the batch time for future execution.

### BatchTimer.setBatchExecutor(batchExecutorFn)
Supply your own context for which the tasks to be executed within. This can be particularly useful when developing with Angular 1.x or React.

Angular 1.x:

	BatchTimer.setBatchExecutor(function (executeTasks) {

		$scope.applyAsync(executeTasks);
	});

React:

	BatchTimer.setBatchExecutor(function (executeTasks) {

		React.unstable_batchedUpdates(executeTasks);
	});

### BatchTimer.setErrorLogger(errorLoggerFn)
Supply your own function to handle error logging.

	BatchTimer.setErrorLogger(function (e) { 
		
		/* Your logging code */;
		yourErrorLogger(e);
	});
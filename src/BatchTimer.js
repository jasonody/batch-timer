window["BatchTimer"] = (function () {
	
	var MIN_INTERVAL = 50;
	var tasks = [];
	var overdueTasks = [];
	var timerId;
	var batchExecutor = function (fn) { fn(); };
	var errorLogger = function (e) { console.error(e); };
	
	return {
		addTask: addTask,
		count: count,
		reset: reset,
		setBatchExecutor: setBatchExecutor,
		setErrorLogger: setErrorLogger
	};
	
	function addTask (task, interval, options) {
		
		var roundedInterval = roundToNearestMinInterval(interval)
		var task = {
			operationFn: task,
			interval: roundedInterval,
			nextRun: +new Date() + roundedInterval,
			failured: false,
			options: sanitizeOptions(options || {})
		};

		tasks.push(task);
		beginTimer();

		return function () { 

			removeTask(task);
		};
	}
	
	function sanitizeOptions (options) {
		
		var o = {};
		o.reoccurring = options.reoccurring || false;
		o.retryOnFailure = options.retryOnFailure || false;
		
		return o;
	};
	
	function removeTask (task) {
		
		var index = overdueTasks.indexOf(task);
		if (index >= 0) {
			overdueTasks.splice(index, 1);
		}

		index = tasks.indexOf(task);
		if (index >= 0) {
			tasks.splice(index, 1);
		}
	}
	
	function count () {
		
		return tasks.length;
	}
	
	function reset () {
		
		clearTimeout(timerId);
		timerId = null;
		
		tasks = [];
		overdueTasks = [];
	}
	
	function setBatchExecutor (batchExecutorFn) {
		
		batchExecutor = batchExecutorFn;
	};
	
	function setErrorLogger (errorLoggerFn) {
		
		errorLogger = errorLoggerFn;
	};
	
	function roundToNearestMinInterval (suppliedInterval) {
		
		var interval = MIN_INTERVAL;
		
		if (suppliedInterval > MIN_INTERVAL) {
		
			interval = Math.floor(suppliedInterval / MIN_INTERVAL) * MIN_INTERVAL;

			if (suppliedInterval % MIN_INTERVAL > MIN_INTERVAL / 2) {
				interval = interval + MIN_INTERVAL;
			}
		}
		
		return interval;
	}
	
	function beginTimer () {
		
		if (timerId == null) {
			timerId = setTimeout(executeBatch, MIN_INTERVAL);
		}	
	}
	
	function executeBatch () {
		
		timerId = null;
		
		var currentTime = +new Date();
		overdueTasks = tasks.filter(function (task) {
			
			return (task.nextRun <= currentTime);
		});
		
		var executeBatch = batchExecutor;
		
		executeBatch(function () {
			
			var overdueTask;
			
			while (overdueTasks.length) {
				try {
					overdueTask = overdueTasks.shift();

					overdueTask.operationFn();
				} catch (e) {
					overdueTask.failed = true;
					
					var logError = errorLogger;
					logError(e);
				} finally {
					if (overdueTask.options.reoccurring || (overdueTask.failed && overdueTask.options.retryOnFailure)) {
						overdueTask.nextRun = +new Date() + overdueTask.interval;
						
						if (overdueTask.failed && overdueTask.options.retryOnFailure) {
							overdueTask.options.retryOnFailure = false;
						}
					} else {
						removeTask(overdueTask);
					}
				}
			}
		});
		
		beginTimer();
	}
}());
window["BatchTimer"] = (function () {
	
	var MIN_INTERVAL = 50;
	var tasks = [];
	var overdueTasks = [];
	var timerId;
	
	return {
		addTask: addTask,
		count: count,
		reset: reset
	};
	
	function addTask (task, interval) {
		
		var roundedInterval = roundToNearestMinInterval(interval)
		var task = {
			operationFn: task,
			interval: roundedInterval,
			nextRun: +new Date() + roundedInterval
		};

		tasks.push(task);
		beginTimer();

		return function () { 

			removeTask(task);
		};
	}
	
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
	
	function roundToNearestMinInterval (suppliedInterval) {
		
		var interval = Math.floor(suppliedInterval / MIN_INTERVAL) * MIN_INTERVAL;
		
		if (suppliedInterval % MIN_INTERVAL > MIN_INTERVAL / 2) {
			interval = interval + MIN_INTERVAL;
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
		
		while (overdueTasks.length) {
			var overdueTask = overdueTasks.shift();
			
			overdueTask.operationFn();
		}
		
		beginTimer();
	}
}());
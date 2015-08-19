window["BatchTimer"] = (function () {
	
	return {
		addTask: addTask,
		count: count,
		reset: reset
	};
	
	var MIN_INTERVAL = 50;
	var tasks = [];
	
	function addTask (task, interval) {

		var task = {
			operation: task,
			interval: interval,
			nextRun: +new Date() + interval
		};

		tasks.push(task);

		return function () { 

			var index = tasks.indexOf(task);
			if (index >= 0) {
				tasks.splice(index, 1);
			}
		};
	}
	
	function count () {
		
		return tasks.length;
	}
	
	function reset () {
		
		tasks = [];
	}
	
}());
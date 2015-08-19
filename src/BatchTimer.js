function BatchTimer () { }

BatchTimer._tasks = [];
BatchTimer.MIN_INTERVAL = 50;

BatchTimer.addTask = function (task, interval) {

	var task = {
		operation: task,
		interval: interval,
		nextRun: +new Date() + interval
	};

	BatchTimer._tasks.push(task);

	return function () { 

		var index = BatchTimer._tasks.indexOf(task);
		if (index >= 0) {
			BatchTimer._tasks.splice(index, 1);
		}
	};
};

BatchTimer.count = function () {

	return BatchTimer._tasks.length;
};

BatchTimer.reset = function () {
	
	BatchTimer._tasks = [];
};

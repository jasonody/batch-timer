describe('Batch Timer', function () {
	
	beforeEach(function () {
		
		BatchTimer.reset();
	});
	
	it('should be something', function () {
		
		expect(BatchTimer).not.toBe(null);
	});
	
	it('returns a count of the registered tasks', function () {
		
		BatchTimer.addTask(function () {}, 100);
		BatchTimer.addTask(function () {}, 200);
		
		expect(BatchTimer.count()).toBe(2);
	});
	
	it('removes all registered tasks', function () {
		
		BatchTimer.addTask(function () {}, 100);
		BatchTimer.addTask(function () {}, 200);

		expect(BatchTimer.count()).toBe(2);
		
		BatchTimer.reset();
		
		expect(BatchTimer.count()).toBe(0);
	});
	
	it('executes a task', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 50);
		
		setTimeout(function () {
			
			expect(taskExecuted).toBe(true);
			done();
		}, 50);
	});
	
	it('rounds interval down to the nearest minimum interval', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 75);

		setTimeout(function () {

			expect(taskExecuted).toBe(true);
			done();
		}, 50);
	});
	
	it('rounds interval up to the nearest minimum interval', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 76);
		
		setTimeout(function () {
			
			expect(taskExecuted).toBe(false);
			
			setTimeout(function () {

				expect(taskExecuted).toBe(true);
				done();
			}, 50);
		}, 50);
	});
	
	it('allows a task to be removed with a removal function', function (done) {
		
		var taskExecuted = false;

		var removeTask = BatchTimer.addTask(function () { taskExecuted = true; }, 50);
		
		expect(BatchTimer.count()).toBe(1);
		
		removeTask();
		expect(BatchTimer.count()).toBe(0);

		setTimeout(function () {

			expect(taskExecuted).toBe(false);
			done();
		}, 50);
	});
	
	it('allows a task to be removed during batch execution cycle', function (done) {
		
		var removedTaskExecuted = false;
		
		BatchTimer.addTask(function () { removeTask(); }, 0);
		var removeTask = BatchTimer.addTask(function () { removedTaskExecuted = true;}, 0);
		
		setTimeout(function () {
			
			expect(removedTaskExecuted).toBe(false);
			expect(BatchTimer.count()).toBe(1);
			done();
		}, 50);
	});
});
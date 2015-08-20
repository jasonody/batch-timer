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
	
	it('will execute a task', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 50);
		
		setTimeout(function () {
			
			expect(taskExecuted).toBe(true);
			done();
		}, 50);
	});
	
	it('will round interval down to the nearest minimum interval', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 75);

		setTimeout(function () {

			expect(taskExecuted).toBe(true);
			done();
		}, 60);
	});
	
	it('will round interval up to the nearest minimum interval', function (done) {
		
		var taskExecuted = false;
		
		BatchTimer.addTask(function () { taskExecuted = true; }, 76);
		
		setTimeout(function () {
			
			expect(taskExecuted).toBe(false);
			
			setTimeout(function () {

				expect(taskExecuted).toBe(true);
				done();
			}, 60)
		}, 60);
	});
});
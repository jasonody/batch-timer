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
	
	it('executes tasks with batch executor', function (done) {
		
		var context = {};
		var first, second;
		
		BatchTimer.setBatchExecutor(function (executeTasks) {
			
			context.value1 = 'abc';
			context.value2 = 'xyz';
			
			executeTasks();
		});
		
		BatchTimer.addTask(function () {
			
			first = context.value1;
		}, 0);
		
		BatchTimer.addTask(function () {
			
			second = context.value2;
		}, 0);
		
		setTimeout(function () {
			
			expect(first).toBe('abc');
			expect(second).toBe('xyz');
			done();
		}, 60);
	});
	
	it('catches exceptions when executing overdue tasks', function (done) {
		
		var taskExecuted = false;

		BatchTimer.addTask(function () { throw 'error'; }, 0);
		BatchTimer.addTask(function () { taskExecuted = true; }, 0);

		setTimeout(function () {

			expect(taskExecuted).toBe(true);
			done();
		}, 50);
	});
	
	it('logs errors with a custom error logger', function (done) {
		
		var errorLogged = false;
		var error;
		
		BatchTimer.setErrorLogger(function (e) {
			
			errorLogged = true;
			error = e;
		});

		BatchTimer.addTask(function () { throw 'error'; }, 0);

		setTimeout(function () {

			expect(errorLogged).toBe(true);
			expect(error).toBe('error');
			done();
		}, 50);
	});
	
	it('reschedules a reoccurring task', function (done) {
		
		var count = 0;
		
		BatchTimer.addTask(function () {
			count++;
		}, 50, { reoccurring: true });
		
		setTimeout(function () {
			
			expect(BatchTimer.count()).toBe(1);
			expect(count).toBe(3);
			done();
		}, 195);
	});
	
	it('allows a reoccurring task to be removed during batch execution cycle', function (done) {

		var removedTaskExecuted = false;

		BatchTimer.addTask(function () { removeTask(); }, 0);
		var removeTask = BatchTimer.addTask(function () { removedTaskExecuted = true;}, 0,  { reoccurring: true });

		setTimeout(function () {

			expect(removedTaskExecuted).toBe(false);
			expect(BatchTimer.count()).toBe(0);
			done();
		}, 50);
	});
	
	it('removes a task once it has been executed', function (done) {

		BatchTimer.addTask(function () {}, 50);
		BatchTimer.addTask(function () {}, 100);

		expect(BatchTimer.count()).toBe(2);
		
		setTimeout(function () {
			
			expect(BatchTimer.count()).toBe(1);
		}, 50);
		
		setTimeout(function () {
			
			expect(BatchTimer.count()).toBe(0);
			done();
		}, 110);
	});
	
	it('retries a task upon failure', function (done) {

		var count = 0;
		BatchTimer.addTask(function () {

			count++;
			throw 'error';
		}, 0, { retryOnFailure: true });
		
		setTimeout(function () {
			
			expect(count).toBe(2);
			expect(BatchTimer.count()).toBe(0);
			done();
		}, 120);
	});
});
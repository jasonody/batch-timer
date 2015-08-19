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
});
function a(cb) { setTimeout(function() { console.log('aaa'); cb(); }, 1000); }

function b(cb) { setTimeout(function() { console.log('bbb'); cb(); }, 500); }

function c(cb) { setTimeout(function() { console.log('ccc'); cb(); }, 1500); }

function d() { setTimeout(function() { console.log('ddd'); }, 1000); }

function series(func_arr, i) {
	if(i == func_arr.length)
		return;
	func_arr[i](function() {
		series(func_arr, ++i);
	});
}

array = [a, b, c, d];
series(array, 0);

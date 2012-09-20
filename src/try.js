// Try - Do things or do other things if they don't work
var Try = (function() {
	var self = {
		all: all,
	};

	function all()
	{
		var args = Array.prototype.slice(arguments),
			arg;

		for (var i = 0, imax = arguments.length; i < imax; i ++)
			if (arguments[i] instanceof Array)
				for (var j = 0, jmax = arguments[i].length; j < jmax; j ++)
					try {
						return arguments[i][j]();
					}
					catch (e) {}
			else
				try {
					return arguments[i]();
				}
				catch (e) {}
	}

	return self;
})();

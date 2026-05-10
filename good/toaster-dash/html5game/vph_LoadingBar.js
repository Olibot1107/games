function LoadingBar_hook(_context, _width, _height, _total, _current, _image) {
	if (loading_set_progress != undefined) {
		loading_set_progress(_current / _total);
	}
}
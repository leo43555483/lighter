    function Fetch(opt, v) {
        this.opt = opt;
        this.view = v;
    }
    Fetch.prototype.fetch = function() {
        let self = this;
        fetch(self.opt.url, self.opt.init).then(function(res) {
            if (res.ok) {
                self.view.success(res);

            }
            if (!res.ok) {
                self.view.failed(res);
            }
        }).catch(function(e) {
            console.log(e);
        });
    }

    window.Fetch = Fetch;
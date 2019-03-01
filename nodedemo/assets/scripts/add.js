class Create {
    constructor() {
        this.btn = $("#js-btn");
    }
    fn() {
        this.btn.click(yd.throttle(function () {
            console.log("点击测试")
            //上一次的请求 还没有回来 我又发了一次
            const name=$("#username").val();
            const author=$("#userauthor").val();
            const type=$("#usertype").val();
            const params = new URLSearchParams();
        },3000));
    }
}
export default Create;
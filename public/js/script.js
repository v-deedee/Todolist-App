$(".task-box").each(function() {
    let t = this;
    $(this).find(".arrow").on("click", function() {
        let t1 = this;
        $(".task-box").each(function() {
            if ($(this).find(".arrow").attr("id") != $(t1).attr("id")) {
                $(this).find(".description").removeClass("appear");
                $(this).find(".responsive-modify-box").removeClass("modify-box-appear");
                $(this).find(".inner-arrow").removeClass("rotate");
            }
        })
        $(t).find(".description").toggleClass("appear");
        $(t).find(".responsive-modify-box").toggleClass("modify-box-appear");
        $(t).find(".inner-arrow").toggleClass("rotate");

        $(".detail-side #current-id").attr("value", $(t).find(".form-check-input").attr("id"));
        $(".detail-side #new-name").attr("value", $(t).find(".task-name p").html());
        $(".detail-side textarea").text($(t).find(".description p").html());

        $(".list-side #current-id").attr("value", $(t).find("input").attr("id"));
        $(".list-side #new-name").attr("value", $(t).find(".task-name p").html());
        $(".list-side textarea").text($(t).find(".description p").html());
    });

    $(this).find(".form-check-input").on("click", function() {
        $(t).find(".task-name").toggleClass("checked");
    });
});
$(document).ready(function(){

    //var origin = window.location.origin;
    //alert(origin);
   // var path = window.location.pathname.split( '/' );
    //alert(path);
    var uRL = $('meta[name=site-url]').attr('content');
    //alert(uRL); 


    function show_formAjax_error(data){
        if (data.status == 422) {
            $('.error').remove();
            $.each(data.responseJSON.errors, function (i, error) {
                var el = $(document).find('[name="' + i + '"]');
                el.after($('<span class="error">' + error[0] + '</span>'));
            });
        }
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // ========================================
    // script for User Login module
    // ========================================

    $('#user-login').validate({
        rules: {
            email: { required: true },
            password: { required: true }
        },
        messages: {
            email: { required: "Email Address is required" },
            password: { required: "Password is required" }
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL+'/login',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success">Logged In Succesfully.</div>');
                        
                        setTimeout(function(){ window.location.href = uRL; }, 3000);
                    } else {
                       $('.message').append('<div class="alert alert-danger">'+dataResult+'</div>');
                    }
                },
                error: function(data){
                    show_formAjax_error(data)
                }
            });
        }
    });

     // ========================================
    // script for User Forgot Password module
    // ========================================

    $('#user-forgotPassword').validate({
        rules: { email: { required: true } },
        messages: { email: { required: "Email Address is required" } },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $('.btn').prop('disabled',true);
            $.ajax({
                url: uRL+'/forgot-password',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    $('.btn').prop('disabled',false);
                    $('.message').append('<div class="alert alert-danger">'+dataResult+'</div>');
                    
                },
                error: function(data){
                    show_formAjax_error(data)
                }
            });
        }
    });

    $('#user-resetPassword').validate({
        rules: { 
            password: { required: true } ,
            confirm_password: { required: true }
        },
        messages: { 
            password: { required: "password is required" },
            confirm_password: { required: "Confirm password is required" },
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL+'/update-password',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success">Success.</div>');
                        setTimeout(function(){ window.location.href = uRL + '/login'; }, 3000);
                    } else {
                       $('.message').append('<div class="alert alert-danger">'+dataResult+'</div>');
                    }
                },
                error: function(data){
                    show_formAjax_error(data)
                }
            });
        }
    });

     // ========================================
    // script for Change Password User module
    // ========================================
    $('#updatePassword').validate({
        rules: {
            password: { required: true },
            new_pass: { required: true },
            new_confirm: { required: true }
        },
        messages: {
            password: { required: "Password is required" },
            new_pass: { required: "New Password is required" },
            new_confirm: { required: "New Confirm Password is required" }
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $('.message').empty();
            $.ajax({
                url: uRL + '/change-password',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success">Password Changed Succesfully.</div>');
                        setTimeout(function(){ window.location.href = uRL + '/profile'; }, 3000);
                    } 
                    else {
                       $('.message').append('<div class="alert alert-danger">'+dataResult+'</div>');
                    }
                },
                error: function(data){
                    show_formAjax_error(data)
                }
            });
        }
    });

    // ========================================
    // script for User SignUp module
    // ========================================

    $('#user-signup').validate({
        rules: {
            username: { required: true },
            phone: { required: true },
            email: { required: true },
            password: { required: true },
        },
        messages: {
            username: { required: "User Name is required" },
            phone: { required: "Phone is required" },
            email: { required: "Email Address is required" },
            password: { required: "Password is required" },
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL+'/signup',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success">Registration Successfull Please Login with Email and Password.</div>');
                        setTimeout(function(){ window.location.href = uRL+'/login'; }, 3000);
                    } else {
                       $('.message').append('<div class="alert alert-danger">'+dataResult+'</div>');
                    }
                },
                error: function(data){
                    show_formAjax_error(data)
                }
            });
        }
    });

    // ========================================
    // script for Update Profile module
    // ========================================
        $(document).on('click', '.ShowProfile', function () {
            $('#exampleModal').modal('show');
        });

        $('#EditProfile').validate({
            rules: {
                username: { required: true },
                phone: { required: true },
            },
            messages: {
                username: { required: "Name is required" },
                phone: { required: "Phone is required" },
            },
            submitHandler: function (form) {
                $('.message').empty();
                var formdata = new FormData(form);
                $.ajax({
                    url: uRL + '/profile',
                    type: 'POST',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (dataResult){
                        console.log(dataResult);
                        if (dataResult == '1') {
                            $('.message').append('<div class="alert alert-success">Profile Updated Successfully.</div>');
                            setTimeout(function () { $('#exampleModal').modal('hide'); }, 2000);
                            setTimeout(function () { window.location.href = uRL + '/profile'; }, 2000);
                        } else {
                            $('.message').append('<div class="alert alert-danger">' + dataResult + '</div>');
                        }
                    },
                    error: function (dataResult){
                        show_formAjax_error(dataResult);
                    }
                });
            }
        });


        $('.change-user-image').click(function(){
            $('input[name=user_img]').trigger('click');
        })

        $('input[name=user_img]').change(function(){
            var file_data = $(this).prop('files')[0];   
            var form_data = new FormData();                  
            var old_img = $('input[name=old_img]').val();                  
            form_data.append('img', file_data);
            form_data.append('old_img', old_img);
            // alert(form_data);                             
            $.ajax({
                url: uRL+'/user/change-image', 
                data: form_data,                         
                type: 'post',
                contentType: false,
                processData: false,
                success: function(dataResult){
                    if(dataResult == '1'){
                        $('.user-image').append('<div class="alert alert-success mt-2">Profile Image Changes Sucesssfully.</div>');
                        setTimeout(function(){ $('.alert').remove(); },2000);
                    }
                }
            });
        })


        $('.country-select').change(function(){
            var val = $(this).children('option:selected').val();
            $.ajax({
                url: uRL+'/get-country-states',
                type: 'POST',
                data: {country_id:val},
                success:function(response){
                    console.log(response)
                    $('.state-select').html(response);
                }
            })
        });
    
        $('.state-select').change(function(){
            var val = $(this).children('option:selected').val();
            $.ajax({
                url: uRL+'/get-state-city',
                type: 'POST',
                data: {state_id:val},
                success:function(response){
                    console.log(response)
                    $('.city-select').html(response);
                }
            })
        });
       

    // ========================================
    // script for User ContactUs module
    // ========================================
    
    $('#addContactUs').validate({
        rules: {
            user_name: { required: true },
            email: { required: true },
            phone: { required: true },
            description: { required: true }
        },
        messages: {
            user_name: { required: "Please Enter Your Name" },
            email: { required: "Please Enter Your Email address" },
            phone: { required: "Please Enter Your Phone" },
            description: { required: "Please Enter Description" }
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/contact',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success"> Your Message Sended Successfully.</div>');
                        setTimeout(function () { window.location.href = uRL + '/contact'; }, 3000);
                    } else {
                        $('.message').append('<div class="alert alert-danger">' + dataResult + '</div>');
                    }
                },
                error: function (data) {
                    show_formAjax_error(data)
                }
            });
        }
    });

     // ========================================
    // script for Recipe Add favourite module
    // ========================================

    $(document).on("click", ".add-favourite", function (e) { 
        e.preventDefault();
        var el = $(this); 
        var id = $(this).attr('data-id');
        $.ajax({
            url: uRL + '/add-user-favourite',
            type: "POST",
            data: {id:id,action:'add'},
            cache: false,
            success: function (dataResult) {
                if(dataResult.result == '1'){
                    el.addClass('active');
                    el.addClass('remove-favourite');
                    el.removeClass('add-favourite');
                    el.html('<i class="fa fa-heart"> Remove Favourites');
                    $('.fav-count').html(dataResult.count);
                }
            }
        });
    });
    $(document).on("click", ".remove-favourite", function (e) { 
        e.preventDefault();
        var el = $(this);
        var id = $(this).attr('data-id');
        $.ajax({
            url: uRL + '/add-user-favourite',
            type: "POST",
            data: {id:id,action:'remove'},
            cache: false,
            success: function (dataResult) {
                if(dataResult.result == '1'){
                    if(el.hasClass('remove')){ //for favourites page
                        el.parents().parents().parents('#recipe'+id).remove();
                        if($('.recipe-grid').length < 1){
                            window.location.reload();
                        }
                    }else{ //for single page
                        el.removeClass('active');
                        el.removeClass('remove-favourite');
                        el.addClass('add-favourite');
                        el.html('<i class="far fa-heart"> Add to Favourites');
                    }
                    $('.fav-count').html(dataResult.count);
                }
            }
        });
    });

    // ========================================
    // script for Recipe Comments module
    // ========================================
    
    $(document).on('submit','#addComment',function(e){
        e.preventDefault();
        var comment = $('.comment-body').val();
        var recipe = $('.comment-recipe').val();
        var parent = $('.comment-parent').val();
       if(comment == ''){
            $('.message').html('<div class="alert alert-danger">Comment is Empty.</div>');
        }else{
            $.ajax({
                url: uRL+"/comment-store",
                type: "POST",
                data: {recipe:recipe,comment:comment,parent:parent},
                success: function (data) {
                    if(data == '1'){
                        $('.comment-body').val('');
                        $('.message').html('<div class="alert alert-info">'+
                        '<strong>Your Comment Under Authorization Process</strong>'+
                        '</div>');
                        $('.alert.alert-info').delay(5000).fadeOut();

                    }else{
                        $('.comment-body').val('');
                        $('.message').html('<div class="alert alert-info">'+
                        '<strong>'+data+'</strong>'+
                        '</div>');
                        $('.alert.alert-info').delay(2000).fadeOut();
                    }
                }
            });
        }
    });


    $(document).on('click','#reply',function(){
        var parent_id = $(this).attr('data-id');
        var recipe_id = $(this).attr('data-recipe');
        $('#addComment').remove();
            var form = `<form class="pt-3" id="addComment" method="POST">
            <div class="message"></div>
            <div class="content-box">
                <div class="mb-3">
                    <input type="hidden" class="comment-recipe" value="`+recipe_id+`"> 
                    <input type="hidden" class="comment-parent" value="`+parent_id+`"/>
                    <label class="col-form-label">Reply :</label>
                    <textarea class="form-control comment-body"></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary link-btn">Post Comment</button>
        </form>`;
        $(this).parent('.display-comment').append(form);
    })

     // ========================================
    // script for User Review Rating module
    // ========================================
    
    $('#addReview').validate({
        rules: {
            comment: { required: true },
        },
        messages: {
            comment: { required: "Please Enter Your Comment" },
        },
        submitHandler: function (form) {
            $('.message').empty();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/review',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('.message').append('<div class="alert alert-success"> Your Review Comment Send Successfully.</div>');
                        setTimeout(function () { window.location.reload(); }, 1000);
                    } else {
                        $('.message').append('<div class="alert alert-danger"> Please Enter Your Login</div>');
                        setTimeout(function () { window.location.href = uRL + '/login'; }, 500);
                    }
                },
                error: function (data) {
                    show_formAjax_error(data)
                }
            });
        }
    });
});
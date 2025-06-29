$(function () {
    var uRL = $('.demo').val();

    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.change-logo').click(function () {
        $('.change-com-img').click();
    });

    // delete data common function
    function destroy_data(name, url) {
        var el = name;
        var id = el.attr('data-id');
        var dltUrl = url + id;
        if (confirm('Are you Sure Want to Delete This')) {
            $.ajax({
                url: dltUrl,
                type: "DELETE",
                cache: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        el.parent().parent('tr').remove();
                    } else {
                        Toast.fire({
                            icon: 'danger',
                            title: dataResult
                        })
                    }
                }
            });
        }
    }

    function show_formAjax_error(data) {
        if (data.status == 422) {
            $('.error').remove();
            $.each(data.responseJSON.errors, function (i, error) {
                var el = $(document).find('[name="' + i + '"]');
                el.after($('<span class="error">' + error[0] + '</span>'));
            });
        }
    }

    // ========================================
    // script for Admin Logout
    // ========================================

    $('.admin-logout').click(function () {
        $.ajax({
            url: uRL + '/admin/logout',
            type: "GET",
            cache: false,
            success: function (dataResult) {
                if (dataResult == '1') {
                    setTimeout(function () {
                        window.location.href = uRL + '/admin';
                    }, 500);
                    Toast.fire({
                        icon: 'success',
                        title: 'Logged Out Succesfully.'
                    })
                }
            }
        });
    });

    // ========================================
    // script for Users module
    // ========================================
    $(document).on("click", ".block-user", function () {
        var status = $(this).attr('data-status');
        var id = $(this).attr('data-id');
        $.ajax({
            url: uRL + '/admin/users/change-status',
            type: "POST",
            data:  {status:status, id:id },
            cache: false,
            success: function (dataResult) {
                if (dataResult == '1') {
                    setTimeout(function () {
                        window.location.href = uRL + '/admin/users';
                    }, 1000);
                    Toast.fire({
                        icon: 'success',
                        title: 'Change Status Succesfully.'
                    })
                }
            }
        });
    });

    $(document).on("click", ".delete-user", function () {
        destroy_data($(this), 'users/')
    });

     // ========================================
    // script for All Recipe module
    // ========================================

    $('#addRecipe').validate({
        rules: {
            image: { required: true },
            recipe: { required: true },
            pre_time: { required: true },
            cook_time: { required: true },
            category: { required: true },
            cuisine: { required: true },
            cookingMethod: { required: true },
            nutrition: { required: true },
            nutritionUnit: { required: true },
            serving: { required: true },
            difficulty: { required: true },
            youtube_video_id: { required: true },
            description: { required: true },
           
        },
        messages: {
            recipe: { required: "Please Enter Recipe Name" },
            category: { required: "Please Enter Category Name" },
            pre_time: { required: "Please Enter Recipe Pre Time" },
            cook_time: { required: "Please Enter Recipe Cook Time" },
            cuisine: { required: "Please Enter Category Recipe Cuisine Name" },
            cookingMethod: { required: "Please Enter Cooking Method Name" },
            nutrition: { required: "Please Enter Nutrition Name" },
            nutritionUnit: { required: "Please Enter Nutrition Unit Name" },
            serving: { required: "Please Enter Recipe Serving" },
            difficulty: { required: "Please Enter difficulty Name" },
            youtube_video_id: { required: "Please Enter Video Name" },
            description: { required: "Please Enter Description Recipe Name" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            formdata.append('gallery', $('input[name^=gallery]').prop('files'));
            $.ajax({
                url: uRL + '/admin/all-recipe',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/all-recipe'; }, 1000)
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $("#editRecipe").validate({
        rules: {
            recipe: { required: true },
          //  recipe_slug: { required: true },
            category: { required: true },
            cuisine: { required: true },
            cookingMethod: { required: true },
            nutrition: { required: true },
            nutritionUnit: { required: true },
            serving: { required: true },
            youtube_video_id: { required: true },
            description: { required: true },
            difficulty: { required: true },
            status: { required: true },
        },
        messages: {
            recipe: { required: "Please Enter Recipe Name" },
          //  recipe_slug: { required: "Please Enter Recipe Slug Name" },
            category: { required: "Please Enter Category Name" },
            cuisine: { required: "Please Enter Category Recipe Cuisine Name" },
            cookingMethod: { required: "Please Enter Cooking Method Name" },
            nutrition: { required: "Please Enter Nutrition Name" },
            nutritionUnit: { required: "Please Enter Nutrition Unit Name" },
            serving: { required: "Please Enter Recipe Serving" },
            youtube_video_id: { required: "Please Enter Video Name" },
            description: { required: "Please Enter Description Category Name" },
            difficulty: { required: "Please Enter Difficulty Name" },
            status: { required: "Please Enter Status Name" },
        },
        submitHandler: function (form) {
            var id = $('.url').val();
            var formdata = new FormData(form);
            formdata.append('gallery', $('input[name^=gallery1]').prop('files'));
            $.ajax({
                url: id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                   console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/all-recipe'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-recipe", function () {
        destroy_data($(this), 'all-recipe/')
    });

    
    // ========================================
    // script for Category module
    // ========================================

    $('#addCategory').validate({
        rules: {
            category: { required: true },
        },
        messages: {
            category: { required: "Please Enter Category Name" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/category',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/category'; }, 1000)
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $("#updateCategory").validate({
        rules: { 
            category: { required: true }, 
            category_slug: { required: true },
            status: { required: true }, 
        },
        messages:{ 
            category: { required: "Please Enter Category Name" }, 
            category_slug: { required: "Please Enter Category Slug Name" }, 
            status: { required: "Please Enter Status" }, 
        },
        submitHandler: function (form) {
            var id = $('.url').val();
            var formdata = new FormData(form);
            $.ajax({
                url: id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/category'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-category", function () {
        destroy_data($(this), ' category/')
    });

    // ========================================
    // script for Sub Category module
    // ========================================

    

    $(document).on('click', '.showContactMessage', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'contact-messages/' + id;
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                console.log(dataResult);
                $('#modal-message .name').html(dataResult.user_name);
                $('#modal-message .email').html(dataResult.email);
                $('#modal-message .phone').html(dataResult.phone);
                $('#modal-message .message').html(dataResult.description);
                $('#modal-message').modal('show');
            }
        });
    });

    

    $(document).on("click", ".delete-contact-message", function () {
        destroy_data($(this), 'contact-messages/')
    });


    // ========================================
    // script for Recipe Cuisine module
    // ========================================

    $('#addCuisine').validate({
        rules: { cuisine: { required: true }, },
        messages: { cuisine: { required: "Please Enter Recipe Cuisine Name" }, },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/recipe-cuisine',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Recipe Cuisine Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editCuisine', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'recipe-cuisine/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].cuisine_id);
                $('#modal-info input[name=cuisine]').val(dataResult[0].cuisine_name);
                $('#modal-info input[name=cuisine_slug]').val(dataResult[0].cuisine_slug);
                $("#modal-info select[name=status] option").each(function () {
                    if ($(this).val() == dataResult[0].status) {
                        $(this).attr('selected', true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].cuisine_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editCuisine").validate({
        rules: {
            cuisine: { required: true },
            cuisine_slug: { required: true },
            status: { required: true }
        },
        messages: {
            cuisine: { required: "Please Enter Recipe Cuisine Name" },
            cuisine: { required: "Please Enter Recipe Cuisine Slug Name" },
            status: { required: "Please Enter Recipe Cuisine Status" }
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/recipe-cuisine' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Recipe Cuisine Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-cuisine", function () {
        destroy_data($(this), 'recipe-cuisine/')
    });

     // ========================================
    // script for Cooking Method module
    // ========================================

    $('#addCooking').validate({
        rules: { cooking: { required: true }, },
        messages: { cooking: { required: "Please Enter Cooking Name Method" }, },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/cooking-method',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Cooking Method Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editCooking', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'cooking-method/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].cooking_id);
                $('#modal-info input[name=cooking]').val(dataResult[0].cooking_name);
                $("#modal-info select[name=status] option").each(function () {
                    if ($(this).val() == dataResult[0].status) {
                        $(this).attr('selected', true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].cooking_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editCooking").validate({
        rules: {
            cooking: { required: true },
            status: { required: true }
        },
        messages: {
            cooking: { required: "Please Enter Cooking Name Method" },
            status: { required: "Please Enter Cooking Name Method Status" }
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/cooking-method' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Cooking Method Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-cooking", function () {
        destroy_data($(this), 'cooking-method/')
    });

    // ========================================
    // script for Nutrition Method module
    // ========================================

    $('#addNutrition').validate({
        rules: { nutrition: { required: true }, },
        messages: { nutrition: { required: "Please Enter Nutrition Name" }, },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/nutrition',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Nutrition Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editNutrition', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'nutrition/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].nutrition_id);
                $('#modal-info input[name=nutrition]').val(dataResult[0].nutrition_name);
                $("#modal-info select[name=status] option").each(function () {
                    if ($(this).val() == dataResult[0].status) {
                        $(this).attr('selected', true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].nutrition_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editNutrition").validate({
        rules: {
            nutrition: { required: true },
            status: { required: true }
        },
        messages: {
            nutrition: { required: "Please Enter Nutrition Name" },
            status: { required: "Please Enter Nutrition Name Status" }
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/nutrition' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Nutrition Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                }
            });
        },
        error: function (error) {
            show_formAjax_error(error);
        }
    });

    $(document).on("click", ".delete-nutrition", function () {
        destroy_data($(this), 'nutrition/')
    });

     // ========================================
    // script for Nutrition Unit Method module
    // ========================================

    $('#addUnit').validate({
        rules: { nutrition_unit: { required: true }, },
        messages: { nutrition_unit: { required: "Please Enter Nutrition Unit Name" }, },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/nutrition-unit',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Nutrition Unit Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editUnit', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'nutrition-unit/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].unit_id);
                $('#modal-info input[name=nutrition_unit]').val(dataResult[0].nutrition_unit);
                $("#modal-info select[name=status] option").each(function () {
                    if ($(this).val() == dataResult[0].status) {
                        $(this).attr('selected', true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].unit_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editUnit").validate({
        rules: {
            nutrition_unit: { required: true },
            status: { required: true }
        },
        messages: {
            nutrition_unit: { required: "Please Enter Nutrition Unit Name" },
            status: { required: "Please Enter Cooking Name Method Status" }
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/nutrition-unit' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Nutrition Unit Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-unit", function () {
        destroy_data($(this), 'nutrition-unit/')
    });

    // ========================================
    // script for Country module
    // ========================================

    $('#addCountry').validate({
        rules: { country: { required: true }, },
        messages: { country: { required: "Please Enter Country Name" }, },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/country',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Country Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editCountry', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'country/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].country_id);
                $('#modal-info input[name=country]').val(dataResult[0].country_name);
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].country_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editCountry").validate({
        rules: { country: { required: true }, },
        messages: { country: { required: "Please Enter Country Name" }, },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/country' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Country Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-country", function () {
        destroy_data($(this), 'country/')
    });

     // ========================================
    // script for State module
    // ========================================

    $('#addState').validate({
        rules: { 
            state: { required: true },
            country: { required: true },
        },
        messages: { 
            state: { required: "Please Enter State Name" }, 
            country: { required: "Please Enter Country Name" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/state',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editState', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'state/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].state_id);
                $('#modal-info input[name=state]').val(dataResult[0].state_name);
                $('#modal-info input[name=country]').val(dataResult[0].country_id);
                $("#modal-info select[name=country] option").each(function(){
                    if($(this).val() == dataResult[0].country_id){
                        $(this).attr('selected',true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].state_id);
                $('#modal-info').modal('show');
            }
        });
    });

    $("#editState").validate({
        rules: { 
            state: { required: true },
            country: { required: true },
        },
        messages: { 
            state: { required: "Please Enter State Name" }, 
            country: { required: "Please Enter Country Name" },
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/state' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-state", function () {
        destroy_data($(this), ' state/')
    });

    // ========================================
    // script for City module
    // ========================================

    $('#addCity').validate({
        rules: {
            city: { required: true },
            state: { required: true }
        },
        messages: {
            city: { required: "Please Enter City Name" },
            state: { required: "Please Enter State Name" }
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/city',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.editCity', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'city/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].city_id);
                $('#modal-info input[name=city]').val(dataResult[0].city_name);
                $('#modal-info input[name=state]').val(dataResult[0].state_id);
                $("#modal-info select[name=state] option").each(function () {
                    if ($(this).val() == dataResult[0].state_id) {
                        $(this).attr('selected', true);
                    }
                });
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].city_id);
                $('#modal-info').modal('show');

            }
        });
    });

    $("#editCity").validate({
        rules: {
            city: { required: true },
            state: { required: true }
        },
        messages: {
            city: { required: "Please Enter City Name" },
            state: { required: "Please Enter State Name" }
        },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/city' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-city", function () {
        destroy_data($(this), ' city/')
    });

    // ========================================
    // script for Service module
    // ========================================
    $('#addService').validate({
        rules: {
            service: { required: true },
            category: { required: true },
            amount: { required: true },
            service_description: { required: true },
        },
        messages: {
            service: { required: "Please Enter Service Name" },
            category: { required: "Please Enter Category Name" },
            amount: { required: "Please Enter Service Amount" },
            service_description: { required: "Please Enter Service Description" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/services',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Service Added Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/services'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $('#EditService').validate({
        rules: {
            service: { required: true },
            service_slug: { required: true },
            category: { required: true },
            amount: { required: true },
            service_description: { required: true },
            status: { required: true },
        },
        messages: {
            service: { required: "Please Enter Service Name" },
            service_slug: { required: "Please Enter Service Slug Name" },
            category: { required: "Please Enter Category Name" },
            amount: { required: "Please Enter Service Amount" },
            service_description: { required: "Please Enter Service Description" },
            status: { required: "Please Enter Service Status" },
        },

        submitHandler: function (form) {
            var id = $('.url').val();
            var formdata = new FormData(form);
            $.ajax({
                url: id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Service Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/services'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-service", function (){
        destroy_data($(this), 'services/')
    });

     // ========================================
    // script for City module
    // ========================================

    $('#add_city').validate({
        rules: { city: { required: true } },
        messages: { city: { required: "Please Enter City Name" } },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/city',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        $('#modal-default').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on('click', '.edit_city', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'city/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
                $('#modal-info input[name=id]').val(dataResult[0].city_id);
                $('#modal-info input[name=city]').val(dataResult[0].city_name);
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].city_id);
                $('#modal-info').modal('show');
            }
        });
    });

    $("#edit_city").validate({
        rules: { city: { required: true } },
        messages: { city: { required: "Please Enter City Name" } },
        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/city' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        $('#modal-info').modal('hide');
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.reload(); }, 1000);
                    }
                }
            });
        },
        error: function (error) {
            show_formAjax_error(error);
        }
    });

    $(document).on("click", ".delete-city", function () {
        destroy_data($(this), ' city/')
    });

    // ========================================
    // script for Comment module
    // ========================================

    $(document).on('click', '.editComment', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'comment/' + id + '/edit';
        $.ajax({
            url: dltUrl,
            type: "GET",
            cache: false,
            success: function (dataResult) {
              //  console.log(dataResult);
                $('#modal-info input[name=id]').val(dataResult[0].comment_id);
                // $('#modal-info input[name=username]').val(dataResult[0].user_id);
                // $("#modal-info select[name=username] option").each(function(){
                //     if($(this).val() == dataResult[0].user_id){
                //         $(this).attr('selected',true);
                //     }
                // });
                // $('#modal-info input[name=recipe]').val(dataResult[0].recipe_id);
                // $("#modal-info select[name=recipe] option").each(function(){
                //     if($(this).val() == dataResult[0].recipe_id){
                //         $(this).attr('selected',true);
                //     }
                // });
                $('#modal-info textarea[name=comment]').val(dataResult[0].comment);
                //$('#modal-info input[name=username]').val(dataResult[0].user_id);
                $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult[0].comment_id);
                $('#modal-info').modal('show');
            }
        });
    });

    $('#editComment').validate({
        rules: { comment: { required: true }, },
        messages: { comment: { required: "Please Enter User Comment" }, },

        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/comment' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/comment'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-comment", function () {
        destroy_data($(this), 'comment/')
    });

    $(document).on('click','.approve-comment',function(){
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        $.ajax({
            url: 'comment/approve',
            type: 'POST',
            data: {id:id,status:status},
            success: function (dataResult) {
             //   console.log(dataResult);
                if (dataResult == '1'){
                    Toast.fire({
                        icon: 'success',
                        title: 'Saved Succesfully.'
                    });
                    setTimeout(function () { window.location.href = uRL + '/admin/comment'; }, 1000);
                }
            },
            error: function (error) {
                show_formAjax_error(error);
            }
        });
    });

    // ========================================
    // script for Review module
    // ========================================

    $(document).on('click', '.editReview', function () {
        var id = $(this).attr('data-id');
        var dltUrl = 'review/' + id + '/edit';
         $.ajax({
             url: dltUrl,
             type: "GET",
             cache: false,
             success: function (dataResult) {
               //  console.log(dataResult);
                 $('#modal-info input[name=id]').val(dataResult.review_id);
                 // $('#modal-info #recipe').text(dataResult.recipe_id);
                 // $('#modal-info #username').text(dataResult.user_id);
                 // $('#modal-info #rating').text(dataResult.star_rating);
                 $('#modal-info textarea[name=comment]').val(dataResult.comment);
                 $('#modal-info .u-url').val($('#modal-info .u-url').val() + '/' + dataResult.review_id);
                 $('#modal-info').modal('show');
             }
         });
    });
     
    $('#editReview').validate({
        rules: { comment: { required: true }, },
        messages: { comment: { required: "Please Enter Review Comment" }, },

        submitHandler: function (form) {
            var id = $('#modal-info input[name=id]').val();
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/review' + '/' + id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/review'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });
 
    $(document).on("click", ".delete-review", function (){
        destroy_data($(this), 'review/')
    });

    $(document).on('click','.approve-review',function(){
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        $.ajax({
            url: 'review/approve',
            type: 'POST',
            data: {id:id,status:status},
            success: function (dataResult) {
                console.log(dataResult);
                if (dataResult == '1'){
                    Toast.fire({
                        icon: 'success',
                        title: 'Saved Succesfully.'
                    });
                    setTimeout(function () { window.location.href = uRL + '/admin/review'; }, 1000);
                }
            },
            error: function (error) {
                show_formAjax_error(error);
            }
        });
    });

    // ========================================
    // script for General Setting module
    // ========================================

    $('#updateGeneralSetting').validate({
        rules: {
            com_name: { required: true },
            com_email: { required: true },
            address: { required: true },
            phone: { required: true },
            copyright: { required: true },
        },
        messages: {
            com_name: { required: "Company Name is Required" },
            com_email: { required: "Company Email is Required" },
            address: { required: "Company Address is Required" },
            phone: { required: "Company Phone is Required" },
            copyright: { required: "Company Footer Address is Required" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/general-settings',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/general-settings'; }, 1000);
                    }else if (dataResult == '0') {
                        Toast.fire({
                            icon: 'info',
                            title: 'Already Updated.'
                        });
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    // ========================================
    // script for Admin  module
    // ========================================

    $('#updateProfileSetting').validate({
        rules: {
            admin_name: { required: true },
            email: { required: true },
            username: { required: true },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/profile-settings',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/profile-settings'; }, 1000);
                    }else if(dataResult == '0'){
                        Toast.fire({
                            icon: 'info',
                            title: 'Already Updated'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/profile-settings'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });


    $('#updatePassword').validate({
        rules: {
            password: { required: true },
            new: { required: true },
            new_confirm: { required: true,equalTo:'#password' },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/change-password',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/profile-settings'; }, 1000);
                    }else if(dataResult == '0'){
                        Toast.fire({
                            icon: 'info',
                            title: 'Already Updated'
                        });
                    }else{
                        Toast.fire({
                            icon: 'warning',
                            title: dataResult
                        });
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    // ========================================
    // script for Banner Setting module
    // ========================================

    $('#updateBannerSetting').validate({
        rules: {
            title: { required: true },
            sub_title: { required: true },
            status: { required: true },
        },
        messages: {
            title: { required: "Title Name is Required" },
            sub_title: { required: "Banner Sub Title is Required" },
            status: { required: "Banner Status is Required" },
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/banner',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/banner'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    // ========================================
    // script for Social Links  module
    // ========================================

    $('#updateSocialSetting').validate({
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/social-settings',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Social Setting Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/social-settings'; }, 1000);
                    }else if (dataResult == '0') {
                        Toast.fire({
                            icon: 'info',
                            title: 'Already Updated.'
                        });
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    // ========================================
    // script for Page module
    // ========================================
    $('#addPage').validate({
        rules: {
            page_title: { required: true },
            // page_content: { required: true },
        },
        messages: {
            page_title: { required: "Please Enter Page Title Name" },
            // page_content: { required: "Please Enter Page Content Description" },
           
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/pages',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    console.log(dataResult);
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Page Added Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/pages'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $('#EditPage').validate({
        rules: {
            page_title: { required: true },
            // page_slug: { required: true },
            // page_content: { required: true },
            // status: { required: true },
        },
        messages: {
            page_title: { required: "Please Enter Page Title Name" },
            // service_slug: { required: "Please Enter Page Slug Name" },
            // page_content: { required: "Please Enter Page Content Description" },
            // status: { required: "Please Enter Page Status" },
        },

        submitHandler: function (form) {
            var id = $('.url').val();
            var formdata = new FormData(form);
            $.ajax({
                url: id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Page Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/pages'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $(document).on("click", ".delete-page", function (){
        destroy_data($(this), 'pages/')
    });

    $(document).on('click','.show-in-header',function(){
        var id = $(this).attr('id');
        if($('#'+id).is(':checked')){
           var status = 1;
        }else{
            var status = 0;
        }
        id = id.replace('head','');
        $.ajax({
            url: uRL + '/admin/page_showIn_header',
            type: 'POST',
            data: {id:id,status:status},
            success: function (dataResult) {
            }

        });
    })

    $(document).on('click','.show-in-footer',function(){
        var id = $(this).attr('id');
        if($('#'+id).is(':checked')){
           var status = 1;
        }else{
            var status = 0;
        }
        id = id.replace('foot','');
        $.ajax({
            url: uRL + '/admin/page_showIn_footer',
            type: 'POST',
            data: {id:id,status:status},
            success: function (dataResult) {
            }
        });
    })

     // ========================================
    // script for Home Setting Page module
    // ========================================
    $('#addHomeSetting').validate({
        rules: {
            section: { required: true },
            heading: { required: true },
            sub_heading: { required: true },
            total_item: { required: true },
        },
        messages: {
            section: { required: "Please Enter Section Name" },
            heading: { required: "Please Enter Heading Name" },
            sub_heading: { required: "Please Enter Sub Heading Name" },
            total_item: { required: "Please Enter Total Item" },
           
        },
        submitHandler: function (form) {
            var formdata = new FormData(form);
            $.ajax({
                url: uRL + '/admin/home-setting',
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Added Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/home-setting'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    $('#EditHomeSetting').validate({
        rules: {
            heading: { required: true },
            total_item: { required: true },
            status: { required: true },
        },
        messages: {
            heading: { required: "Please Enter Heading Name" },
            total_item: { required: "Please Enter Total Item" },
            status: { required: "Please Enter Page Status" },
        },

        submitHandler: function (form) {
            var id = $('.url').val();
            var formdata = new FormData(form);
            $.ajax({
                url: id,
                type: 'POST',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (dataResult) {
                    if (dataResult == '1') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated Succesfully.'
                        });
                        setTimeout(function () { window.location.href = uRL + '/admin/home-setting'; }, 1000);
                    }
                },
                error: function (error) {
                    show_formAjax_error(error);
                }
            });
        }
    });

    // $(document).on("click", ".delete-homeSetting", function (){
    //     destroy_data($(this), 'homeSetting/')
    // });

    // change home page section order
    $('.save-section-order').click(function(){
        var token = $('meta[name=csrf-token]').attr('content');
        var list = [];
        $('#sortable li').each(function(i){
            list[i] = [i+1,
                $(this).attr('data-id')];
        });
        $.ajax({
            url    : uRL+"/admin/home-setting/change-order",
            type   : "POST",
            data   : {_token:token,list:list},
            success: function(dataResult){
                console.log(dataResult);
                if(dataResult  == '1'){
                    Toast.fire({
                        icon: 'success',
                        title: 'Updated Succesfully.'
                    });
                    window.setTimeout(window.location.href = uRL+"/admin/home-setting", 300);
                }else{
                    Toast.fire({
                        icon: 'warning',
                        title: dataResult
                    });
                }
            }
        });
    });
    
});
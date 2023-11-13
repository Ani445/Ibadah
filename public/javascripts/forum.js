/* <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function () {
        $('#submitBtn').click(function () {
            const content = $('#contentInput').val();
            
            // Use AJAX to send the content to your server-side endpoint
            $.ajax({
                type: 'POST',
                url: '/api/createpost', // Replace with your server-side endpoint
                data: { content: content },
                success: function (response) {
                    // Handle the success response, e.g., display a message
                    console.log('Data sent successfully');
                },
                error: function (error) {
                    // Handle errors, e.g., display an error message
                    console.error('Error sending data: ' + error);
                }
            });
        });
    });
</script> */
// }

$(() => {
   
// Handle form submission using AJAX (as shown in previous code)
$("#postForm").validate({
    rules:{

    },
    messages: {
        paiso: {
            required: "Please type something."
        }
        
    },
    submitHandler: function(form){

        console.log($(form).attr('action'));
        console.log($(form).serialize());
        $.ajax({
            type: $(form).attr('method'),
            url: $(form).attr('action'),
            data: $(form).serialize(),
            dataType : 'json'
        })
            .done(function (response) {
                if (response.success === 1) {    //success
                    window.location.href='/forum'
                } else {
                    // window.location.href='/classes'
                    alert('Something went wrong');
                }
            });
        return false; // required to block normal submit since you used ajax
    },
});


// $(".postComment").validate({
//     rules:{

//     },
//     messages: {
//         paiso: {
//             required: "Please type something."
//         }
        
//     },
//     submitHandler: function(form){

//         console.log($(form).attr('action'));
//         console.log($(form).serialize());
        
//         $.ajax({
//             type: $(form).attr('method'),
//             url: $(form).attr('action'),
//             data: $(form).serialize(),
//             dataType : 'json'
           
            
//         })
//             .done(function (response) {
//                 if (response.success === 1) {    //success
//                     window.location.href='/forum'
//                 } else {
//                     // window.location.href='/classes'
//                     alert('Something went wrong');
//                 }
//             });
//         return false; // required to block normal submit since you used ajax
//     },
// });
})

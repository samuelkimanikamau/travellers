<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    @vite('resources/js/app.jsx')
    @inertiaHead
    <style>
        .ant-pro-form-login-logo {
            width: 100%;
            height: 160px;
            margin-inline-end: 16px;
            vertical-align: top;
        }

        .ant-pro-form-login-header {
            height: 160px !important;
            line-height: 160px !important;
        }

        .ant-pro-layout .ant-pro-sider-logo a img {
            display: inline-block;
            height: 80px;
            vertical-align: middle;
        }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>

<body>
    @inertia
</body>

</html>

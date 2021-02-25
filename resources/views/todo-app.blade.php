<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
    <link href="{{ asset('/css/main.css')  }}" rel="stylesheet">
    <link href="{{ asset('css/bootstrap.min.css')  }}" rel="stylesheet">
    <link href="{{ asset('css/bootstrap-icons.css')  }}" rel="stylesheet">
    <script src="{{ asset('js/jquery-3.5.1.min.js') }}"></script>
    <script src="{{ asset('js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('js/main.js') }}" defer></script>
    <title>todo-app</title>
</head>
<body>

<div class="wrapper d-flex align-items-center justify-content-center">

    <div class="container main-content">
        <div class="row">
            <div class="col-10 offset-1">
                <nav class="navbar main-nav navbar-expand-lg navbar-dark bg-dark d-flex justify-content-between">

                    <a class="navbar-brand" href="#">Hello, {{ Auth::user()->name }}</a>

                    <form method="POST" action="{{ route('logout') }}">

                        @csrf
                        <a class="logout-btn" href="{{ route('logout') }}" onclick="event.preventDefault();
                                        this.closest('form').submit();">
                            {{ __('Log out') }}
                        </a>

                    </form>

                </nav>
            </div>
        </div>


        <div class="row">
            <div class="col-10 offset-1 todos-wrapper">
                <nav class=" bg-dark d-flex">
                    <ul class="d-flex todo-list-nav">
                        @if(count($todoLists) >= 1)
                            @foreach ($todoLists as $key => $todolist)

                                <li class="todolist-nav-btn d-flex {{ $key == 0 ? 'active' : ''}}"
                                    data-todo-list-id="{{ $todolist->id }}">
                                    <input type="text" value="{{ $todolist->name }}" disabled>


                                </li>

                            @endforeach
                        @endif


                    </ul>
                    <div class="d-flex align-items-center add-todo-list-btn">
                        <div id="addTodoListBtn" class="a d-flex align-items-center justify-content-center">
                            <i class="bi bi-plus-circle-fill"></i>
                        </div>
                    </div>
                </nav>
                <ul class="tab-content todos-container">

                    <div class="no-todo-list align-items-center justify-content-center">You haven't any todo
                        lists. <span id="createTodoList1">Create one</span></div>


                </ul>


                <div class="add-todo-container bg-dark d-flex justify-content-center">

                    <input id="addTodoTitle" type="text" placeholder="Todo title (at least 3 characters)">
                    <button id="addTodoBtn" type="button" class="btn btn-success">Add todo</button>

                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>

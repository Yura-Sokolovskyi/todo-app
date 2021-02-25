<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\TodoList;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TodoListController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $req
     * @return string
     */
    public function store(Request $req): string
    {

        $todo = new TodoList();

        $todo->name         = $req->name;
        $todo->user_id      = Auth::id();

        $todo->save();

        return $todo->toJson();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     * @throws Exception
     */
    public function destroy(int $id): Response
    {

        Todo::where('todo_list_id',$id)->delete();
        TodoList::destroy($id);

        return response('todo deleted',200);
    }


    /**
     * Get todo lists by user.
     *
     * @return Application|Factory|View
     */
    public function getUserTodolist (){

        $userID = Auth::id();

        $todoLists = TodoList::where('user_id','=',$userID)->get();

        return view('todo-app',compact('todoLists'));
    }
}

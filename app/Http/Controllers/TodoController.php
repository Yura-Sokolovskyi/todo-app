<?php

namespace App\Http\Controllers;


use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;



class TodoController extends Controller
{
    /**
     * Gets a listing of the todos
     * by TodoList id ordered by position.
     *
     * @param int $id
     * @return string
     */
    public function todosByTodoList(int $id): string
    {

        return Todo::where('todo_list_id', '=', $id)
                    ->orderBy('position')
                    ->get(['id','title','is_done']);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $req
     * @return string
     */
    public function store(Request $req): string
    {
        $todo = new Todo;

        $todo->todo_list_id     = $req->todoListID;
        $todo->title            = $req->title;

        $todo->save();

        return $todo->toJson();
    }

    /**
     * Update todo.
     *
     * @param Request $req
     * @param int $id
     * @return Response
     */
    public function edit(Request $req, int $id): Response
    {
        $todo = Todo::firstWhere('id', $id);

        $todo->title    = $req->title;
        $todo->is_done  = $req->isDone;

        $todo->save();

        return response('success',200);
    }

    /**
     * Update todos position.
     *
     * @param Request $req
     * @return Response
     */
    public function update(Request $req): Response
    {

        for ($i = 0; $i < count($req->order); $i++) {

            $todo = Todo::firstWhere('id', intval($req->order[$i]));
            $todo->position  = $i;

            $todo->update();

        }

        return response('success',200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy(int $id): Response
    {
        Todo::destroy($id);
        return response('success',200);
    }
}

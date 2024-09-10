<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Category;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class IssueController extends Controller
{
    public function index(Request $request)
    {
        $issues = Issue::with(['category', 'creator', 'assignees', 'approver'])
            ->when($request->search, function ($query, $search) {
                return $query->where('description', 'like', "%{$search}%");
            })
            ->get();

        return Inertia::render('Issues/Index', [
            'issues' => $issues,
            'categories' => Category::whereNull('parent_id')->with('subcategories')->get(),
            'users' => User::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Issues/Create', [
            'categories' => Category::all(),
            'users' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'assigned_to' => 'required|array',
        ]);

        $issue = Issue::create([
            'description' => $request->description,
            'status' => 'Open',
            'category_id' => $request->category_id,
            'created_by' => auth()->id(),
            'start_date' => Carbon::parse($request->start_date),
            'end_date' => Carbon::parse($request->end_date),
        ]);

        $issue->assignees()->sync($request->assigned_to);

        // Send email notifications
        // Mail::to($issue->assignees->pluck('email'))->send(new IssueAssigned($issue));

        return redirect()->route('issues.index')->with('success', 'Issue created successfully.');
    }

    public function edit(Issue $issue)
    {
        return Inertia::render('Issues/Edit', [
            'issue' => $issue->load('assignees'),
            'categories' => Category::all(),
            'users' => User::all(),
        ]);
    }

    public function update(Request $request, Issue $issue)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'assigned_to' => 'required|array',
        ]);

        $issue->update([
            'description' => $request->description,
            'category_id' => $request->category_id,
            'start_date' => Carbon::parse($request->start_date),
            'end_date' => Carbon::parse($request->end_date),
        ]);

        $issue->assignees()->sync($request->assigned_to);

        // Send email notifications if needed
        // Mail::to($issue->assignees->pluck('email'))->send(new IssueUpdated($issue));

        return redirect()->route('issues.index')->with('success', 'Issue updated successfully.');
    }

    public function destroy(Issue $issue)
    {
        $issue->delete();
        return redirect()->route('issues.index')->with('success', 'Issue deleted successfully.');
    }

    public function addComment(Request $request, Issue $issue)
    {
        $request->validate(['comment' => 'required|string']);
        $issue->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $request->comment,
        ]);

        // Send email notifications to related users
        // Mail::to([...])->send(new CommentAdded($issue));

        return redirect()->route('issues.show', $issue->id)->with('success', 'Comment added successfully.');
    }

    public function monitorOverdueIssues()
    {
        $overdueIssues = Issue::where('status', '!=', 'Closed')
            ->where('end_date', '<', Carbon::now())
            ->get();

        // Notify users of overdue issues via email or other means
        // Mail::to([...])->send(new OverdueIssueNotification($overdueIssues));

        return view('issues.overdue', ['overdueIssues' => $overdueIssues]);
    }
}

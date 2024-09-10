<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Issue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'description', 'status', 'category_id', 'created_by', 
        'approved_by', 'start_date', 'end_date', 'approval_date'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function assignees()
    {
        return $this->belongsToMany(User::class, 'issue_assignments');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}


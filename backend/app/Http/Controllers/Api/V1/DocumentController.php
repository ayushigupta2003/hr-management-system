<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $docs = Document::with('employee')
            ->when($request->employee_id, fn ($q, $e) => $q->where('employee_id', $e))
            ->when($request->category,    fn ($q, $c) => $q->where('category', $c))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Documents fetched.',
            'data'    => $docs->items(),
            'meta'    => $docs->toArray(),
        ]);
    }

    public function myDocuments(Request $request)
    {
        // Employee sees only their own documents
        $employee = Employee::where('user_id', auth()->id())->first();

        $docs = Document::with('employee')
            ->when($employee, fn ($q) => $q->where('employee_id', $employee->id))
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Your documents fetched.',
            'data'    => $docs->items(),
            'meta'    => $docs->toArray(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'title'       => ['required', 'string', 'max:200'],
            'category'    => ['required', 'in:id_proof,contract,certificate,offer_letter,other'],
            'file'        => ['required', 'file', 'max:10240'], // 10MB
            'expiry_date' => ['nullable', 'date'],
            'notes'       => ['nullable', 'string'],
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $doc = Document::create([
            'employee_id' => $request->employee_id,
            'title'       => $request->title,
            'category'    => $request->category,
            'file_path'   => $path,
            'file_name'   => $file->getClientOriginalName(),
            'file_size'   => $file->getSize(),
            'mime_type'   => $file->getMimeType(),
            'expiry_date' => $request->expiry_date,
            'notes'       => $request->notes,
        ]);

        return $this->successResponse('Document uploaded.', [
            'document' => $doc->load('employee'),
        ], 201);
    }

    public function update(Request $request, Document $document): JsonResponse
    {
        $request->validate([
            'title'       => ['required', 'string', 'max:200'],
            'category'    => ['required', 'in:id_proof,contract,certificate,offer_letter,other'],
            'expiry_date' => ['nullable', 'date'],
            'notes'       => ['nullable', 'string'],
        ]);

        $document->update($request->only('title', 'category', 'expiry_date', 'notes'));

        return $this->successResponse('Document updated.', ['document' => $document->fresh()]);
    }

    public function destroy(Document $document): JsonResponse
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return $this->successResponse('Document deleted.');
    }

    public function download(Document $document)
    {
        $path = Storage::disk('public')->path($document->file_path);

        return response()->download($path, $document->file_name);
    }
}

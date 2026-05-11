<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::query()->pluck('id', 'employee_code');

        // Documents keyed by employee_code
        $documents = [
            'EMP-1001' => [ // Aarav Sharma – HR Manager
                [
                    'title'       => 'Aadhaar Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1001/aadhaar.pdf',
                    'file_name'   => 'aadhaar.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Verified on joining.',
                ],
                [
                    'title'       => 'Employment Contract',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1001/employment_contract.pdf',
                    'file_name'   => 'employment_contract.pdf',
                    'file_size'   => 512000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Signed copy on file.',
                ],
                [
                    'title'       => 'MBA Certificate – XLRI Jamshedpur',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1001/mba_certificate.pdf',
                    'file_name'   => 'mba_certificate.pdf',
                    'file_size'   => 358400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
            ],

            'EMP-1003' => [ // Rohan Mehta – Engineering Lead
                [
                    'title'       => 'Offer Letter',
                    'category'    => 'offer_letter',
                    'file_path'   => 'documents/emp-1003/offer_letter.pdf',
                    'file_name'   => 'offer_letter.pdf',
                    'file_size'   => 307200,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Original offer letter dated 2021-06-01.',
                ],
                [
                    'title'       => 'PAN Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1003/pan_card.pdf',
                    'file_name'   => 'pan_card.pdf',
                    'file_size'   => 153600,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'B.Tech Certificate – IIT Bombay',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1003/btech_certificate.pdf',
                    'file_name'   => 'btech_certificate.pdf',
                    'file_size'   => 409600,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'AWS Solutions Architect Certification',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1003/aws_cert.pdf',
                    'file_name'   => 'aws_cert.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2027-03-15',
                    'notes'       => 'Renewal required every 3 years.',
                ],
            ],

            'EMP-1004' => [ // Maya Iyer – Senior Software Engineer
                [
                    'title'       => 'Employment Contract',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1004/employment_contract.pdf',
                    'file_name'   => 'employment_contract.pdf',
                    'file_size'   => 512000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Aadhaar Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1004/aadhaar.pdf',
                    'file_name'   => 'aadhaar.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Non-Disclosure Agreement',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1004/nda.pdf',
                    'file_name'   => 'nda.pdf',
                    'file_size'   => 256000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Signed on joining date.',
                ],
            ],

            'EMP-1007' => [ // Karan Singh – DevOps Engineer
                [
                    'title'       => 'Offer Letter',
                    'category'    => 'offer_letter',
                    'file_path'   => 'documents/emp-1007/offer_letter.pdf',
                    'file_name'   => 'offer_letter.pdf',
                    'file_size'   => 307200,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'CKA Certification – Linux Foundation',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1007/cka_cert.pdf',
                    'file_name'   => 'cka_cert.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2026-11-20',
                    'notes'       => 'Expires Nov 2026. Renewal in progress.',
                ],
                [
                    'title'       => 'Passport',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1007/passport.pdf',
                    'file_name'   => 'passport.pdf',
                    'file_size'   => 358400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2030-08-14',
                    'notes'       => null,
                ],
            ],

            'EMP-1009' => [ // Vikram Joshi – Finance Manager
                [
                    'title'       => 'Employment Contract',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1009/employment_contract.pdf',
                    'file_name'   => 'employment_contract.pdf',
                    'file_size'   => 512000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'CA Certificate – ICAI',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1009/ca_certificate.pdf',
                    'file_name'   => 'ca_certificate.pdf',
                    'file_size'   => 409600,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'PAN Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1009/pan_card.pdf',
                    'file_name'   => 'pan_card.pdf',
                    'file_size'   => 153600,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Salary Revision Letter – 2025',
                    'category'    => 'other',
                    'file_path'   => 'documents/emp-1009/salary_revision_2025.pdf',
                    'file_name'   => 'salary_revision_2025.pdf',
                    'file_size'   => 102400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Effective from 2025-04-01.',
                ],
            ],

            'EMP-1012' => [ // Neha Kapoor – Operations Manager
                [
                    'title'       => 'Offer Letter',
                    'category'    => 'offer_letter',
                    'file_path'   => 'documents/emp-1012/offer_letter.pdf',
                    'file_name'   => 'offer_letter.pdf',
                    'file_size'   => 307200,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Aadhaar Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1012/aadhaar.pdf',
                    'file_name'   => 'aadhaar.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'PMP Certification',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1012/pmp_cert.pdf',
                    'file_name'   => 'pmp_cert.pdf',
                    'file_size'   => 256000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2027-01-10',
                    'notes'       => 'PDU renewal required every 3 years.',
                ],
            ],

            'EMP-1014' => [ // Pooja Malhotra – Marketing Manager
                [
                    'title'       => 'Employment Contract',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1014/employment_contract.pdf',
                    'file_name'   => 'employment_contract.pdf',
                    'file_size'   => 512000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Google Analytics Certification',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1014/ga4_cert.pdf',
                    'file_name'   => 'ga4_cert.pdf',
                    'file_size'   => 153600,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2026-09-30',
                    'notes'       => 'Annual renewal required.',
                ],
                [
                    'title'       => 'Passport',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1014/passport.pdf',
                    'file_name'   => 'passport.pdf',
                    'file_size'   => 358400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => '2029-05-22',
                    'notes'       => null,
                ],
            ],

            'EMP-1017' => [ // Amit Tiwari – Sales Manager
                [
                    'title'       => 'Offer Letter',
                    'category'    => 'offer_letter',
                    'file_path'   => 'documents/emp-1017/offer_letter.pdf',
                    'file_name'   => 'offer_letter.pdf',
                    'file_size'   => 307200,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Non-Disclosure Agreement',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1017/nda.pdf',
                    'file_name'   => 'nda.pdf',
                    'file_size'   => 256000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Aadhaar Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1017/aadhaar.pdf',
                    'file_name'   => 'aadhaar.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Salary Revision Letter – 2025',
                    'category'    => 'other',
                    'file_path'   => 'documents/emp-1017/salary_revision_2025.pdf',
                    'file_name'   => 'salary_revision_2025.pdf',
                    'file_size'   => 102400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => 'Effective from 2025-10-01.',
                ],
            ],

            'EMP-1002' => [ // Priya Nair – HR Executive
                [
                    'title'       => 'Employment Contract',
                    'category'    => 'contract',
                    'file_path'   => 'documents/emp-1002/employment_contract.pdf',
                    'file_name'   => 'employment_contract.pdf',
                    'file_size'   => 512000,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'Aadhaar Card',
                    'category'    => 'id_proof',
                    'file_path'   => 'documents/emp-1002/aadhaar.pdf',
                    'file_name'   => 'aadhaar.pdf',
                    'file_size'   => 204800,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
                [
                    'title'       => 'BBA Certificate',
                    'category'    => 'certificate',
                    'file_path'   => 'documents/emp-1002/bba_certificate.pdf',
                    'file_name'   => 'bba_certificate.pdf',
                    'file_size'   => 358400,
                    'mime_type'   => 'application/pdf',
                    'expiry_date' => null,
                    'notes'       => null,
                ],
            ],
        ];

        foreach ($documents as $empCode => $empDocs) {
            $employeeId = $employees[$empCode] ?? null;

            if (! $employeeId) {
                continue;
            }

            foreach ($empDocs as $doc) {
                Document::query()->updateOrCreate(
                    [
                        'employee_id' => $employeeId,
                        'file_path'   => $doc['file_path'],
                    ],
                    array_merge($doc, ['employee_id' => $employeeId])
                );
            }
        }
    }
}

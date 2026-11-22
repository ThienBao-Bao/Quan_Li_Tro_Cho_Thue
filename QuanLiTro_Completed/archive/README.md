# Archive – superseded material

The files in this folder are **not part of the submission**. They are kept only for history.

| File | Why it is archived |
|------|--------------------|
| `SRS_QuanLiTro_v1.0.docx` | **Superseded.** The requirement baseline for all four labs is `SRS_BoardingHouseManagementSystem v1.1` (in `../Labs/`). The two documents reuse the same requirement numbers for **different** requirements — for example FR-14 means "add-guest modal" in v1.0 but "contract renewal" in v1.1 — so keeping v1.0 alongside the labs would make the traceability ambiguous. |
| `generate_srs.mjs` | The Node script that produced the v1.0 SRS above. It is not imported by the application and is not needed to build, run or test the project. It is the only reason the `docx` dev-dependency exists. |

**Authoritative documents for this submission** (in `../Labs/`):

- `SRS_BoardingHouseManagementSystem_v1.1_EN.docx` – requirement baseline (FR-01…FR-30, UCS-01…UCS-06)
- `TestPlan_BoardingHouseManagementSystem_v1.0_EN.docx` – governing test plan

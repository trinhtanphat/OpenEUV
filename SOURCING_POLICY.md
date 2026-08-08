# OpenEUV Sourcing Policy

OpenEUV is built around **auditable public-source reconstruction**.

## Evidence classes

| Class | Meaning | Examples |
| --- | --- | --- |
| A | First-party public source | ASML, ZEISS, TSMC public pages or releases |
| B | Patent / standard | Published patent specifications, public standards |
| C | Academic | Peer-reviewed paper, thesis, reputable conference material |
| D | Inference | A conclusion derived from cited A/B/C evidence |
| ? | Unknown | Insufficient public evidence |

Every technical claim should carry one of these states. A visual model may combine multiple claims, but nontrivial geometry that is not directly documented must be labeled `illustrative` or `inferred`.

## Source requirements

A contribution should record the exact claim, source URL/DOI/patent identifier, source class, what the source establishes, uncertainty/assumptions, and whether the resulting asset is a direct fact, educational simplification, or inference.

## Do not submit

- stolen, hacked or unlawfully obtained documents;
- leaked confidential documents or trade-secret dumps;
- credentials, private access tokens or gated material shared without permission;
- proprietary CAD, internal service documentation or fab recipes without explicit redistribution rights;
- copied figures when copyright does not permit repository redistribution;
- anonymous claims presented as established fact.

If an interesting claim exists only in questionable material, create an **open question** describing it at a high level and ask contributors to locate a lawful public source. Do not upload or link the questionable material.

## Preferred reconstruction method

`official → patent → academic cross-check → independent reconstruction → uncertainty review`

#!/usr/bin/env python3
import argparse
import base64
import json
import math
import struct
from pathlib import Path


def pack_floats(values):
    return b"".join(struct.pack("<f", value) for value in values)


def pack_ushorts(values):
    return b"".join(struct.pack("<H", value) for value in values)


def box_geometry():
    points = [
        (-.5, -.5, -.5), (.5, -.5, -.5), (.5, .5, -.5), (-.5, .5, -.5),
        (-.5, -.5, .5), (.5, -.5, .5), (.5, .5, .5), (-.5, .5, .5),
    ]
    faces = [
        (0, 1, 2, 3, (0, 0, -1)), (5, 4, 7, 6, (0, 0, 1)),
        (4, 0, 3, 7, (-1, 0, 0)), (1, 5, 6, 2, (1, 0, 0)),
        (3, 2, 6, 7, (0, 1, 0)), (4, 5, 1, 0, (0, -1, 0)),
    ]
    positions, normals, indices = [], [], []
    for face in faces:
        start = len(positions) // 3
        for vertex in face[:4]:
            positions.extend(points[vertex])
            normals.extend(face[4])
        indices.extend([start, start + 1, start + 2, start, start + 2, start + 3])
    return positions, normals, indices


def cylinder_geometry(segments=48):
    positions, normals, indices = [], [], []
    for y in (-.5, .5):
        for index in range(segments):
            angle = 2 * math.pi * index / segments
            x, z = math.cos(angle) * .5, math.sin(angle) * .5
            positions.extend((x, y, z))
            normals.extend((x * 2, 0, z * 2))
    for index in range(segments):
        next_index = (index + 1) % segments
        a, b, c, d = index, next_index, segments + next_index, segments + index
        indices.extend((a, b, c, a, c, d))
    for y, normal_y in ((-.5, -1), (.5, 1)):
        center = len(positions) // 3
        positions.extend((0, y, 0))
        normals.extend((0, normal_y, 0))
        ring = []
        for index in range(segments):
            angle = 2 * math.pi * index / segments
            positions.extend((math.cos(angle) * .5, y, math.sin(angle) * .5))
            normals.extend((0, normal_y, 0))
            ring.append(center + 1 + index)
        for index in range(segments):
            next_index = (index + 1) % segments
            indices.extend((center, ring[next_index], ring[index]) if normal_y < 0 else (center, ring[index], ring[next_index]))
    return positions, normals, indices


def write_asset(nodes, output):
    chunks, views, accessors = [], [], []

    def add_geometry(geometry):
        positions, normals, indices = geometry
        offset = sum(len(chunk) for chunk in chunks)
        data = pack_floats(positions)
        chunks.append(data)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": 34962})
        position_view = len(views) - 1

        offset += len(data)
        data = pack_floats(normals)
        chunks.append(data)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": 34962})
        normal_view = len(views) - 1

        offset += len(data)
        data = pack_ushorts(indices)
        chunks.append(data)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": 34963})
        index_view = len(views) - 1

        vertices = [positions[index:index + 3] for index in range(0, len(positions), 3)]
        minimum = [min(vertex[index] for vertex in vertices) for index in range(3)]
        maximum = [max(vertex[index] for vertex in vertices) for index in range(3)]
        position_accessor = len(accessors)
        accessors.append({"bufferView": position_view, "componentType": 5126, "count": len(vertices), "type": "VEC3", "min": minimum, "max": maximum})
        normal_accessor = len(accessors)
        accessors.append({"bufferView": normal_view, "componentType": 5126, "count": len(vertices), "type": "VEC3"})
        index_accessor = len(accessors)
        accessors.append({"bufferView": index_view, "componentType": 5123, "count": len(indices), "type": "SCALAR", "min": [min(indices)], "max": [max(indices)]})
        return {"attributes": {"POSITION": position_accessor, "NORMAL": normal_accessor}, "indices": index_accessor}

    box_primitive = add_geometry(box_geometry())
    cylinder_primitive = add_geometry(cylinder_geometry())
    blob = b"".join(chunks)
    document = {
        "asset": {"version": "2.0", "generator": "OpenEUV reproducible concept asset generator"},
        "scene": 0,
        "scenes": [{"nodes": list(range(len(nodes)))}],
        "nodes": nodes,
        "meshes": [
            {"name": "UnitBox", "primitives": [{**box_primitive, "material": 0}]},
            {"name": "UnitCylinder", "primitives": [{**cylinder_primitive, "material": 1}]},
        ],
        "materials": [
            {"name": "FrameMaterial", "pbrMetallicRoughness": {"baseColorFactor": [.15, .45, .65, 1], "metallicFactor": .75, "roughnessFactor": .25}},
            {"name": "OpticMaterial", "pbrMetallicRoughness": {"baseColorFactor": [.55, .42, .9, 1], "metallicFactor": .9, "roughnessFactor": .12}},
        ],
        "buffers": [{"byteLength": len(blob), "uri": "data:application/octet-stream;base64," + base64.b64encode(blob).decode()}],
        "bufferViews": views,
        "accessors": accessors,
    }
    path = Path(output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(document, separators=(",", ":")), encoding="utf-8")


SOURCE = [
    {"name": "SourceFrame", "mesh": 0, "translation": [0, 0, 0], "scale": [3.2, 2.5, 2.4]},
    {"name": "CollectorConcept", "mesh": 1, "translation": [.7, .35, 0], "rotation": [.7071, 0, 0, .7071], "scale": [1.65, .18, 1.65]},
    {"name": "DropletGenerator", "mesh": 1, "translation": [-1.25, 1.0, 0], "scale": [.32, 1.1, .32]},
    {"name": "PlasmaMarker", "mesh": 1, "translation": [-.35, .3, 0], "scale": [.4, .4, .4]},
    {"name": "LaserInput", "mesh": 1, "translation": [-1.2, -.35, 0], "rotation": [0, 0, .7071, .7071], "scale": [.18, 1.0, .18]},
    {"name": "IntermediateFocus", "mesh": 1, "translation": [1.65, .35, 0], "rotation": [0, 0, .7071, .7071], "scale": [.12, .65, .12]},
    {"name": "ContaminationShield", "mesh": 0, "translation": [.25, .35, 0], "scale": [.12, 1.7, 1.8]},
]

ILLUMINATION = [
    {"name": "IlluminationFrame", "mesh": 0, "translation": [0, 0, 0], "scale": [3.1, 2.7, 2.4]},
    {"name": "CollectorHandoff", "mesh": 1, "translation": [-1.25, .65, 0], "rotation": [.7071, 0, 0, .7071], "scale": [.65, .08, .65]},
    {"name": "FieldMirrorConcept-1", "mesh": 1, "translation": [-.45, .7, -.35], "rotation": [.7071, 0, 0, .7071], "scale": [.7, .08, .7]},
    {"name": "FieldMirrorConcept-2", "mesh": 1, "translation": [.25, .15, .35], "rotation": [.7071, 0, 0, .7071], "scale": [.62, .08, .62]},
    {"name": "FieldMirrorConcept-3", "mesh": 1, "translation": [.9, -.35, -.25], "rotation": [.7071, 0, 0, .7071], "scale": [.55, .08, .55]},
    {"name": "PupilShapingConcept", "mesh": 1, "translation": [.35, .9, 0], "scale": [.48, .14, .48]},
    {"name": "MaskHandoffPlane", "mesh": 0, "translation": [1.35, -.55, 0], "scale": [.12, 1.15, 1.55]},
]

RETICLE = [
    {"name": "ReticleFrame", "mesh": 0, "translation": [0, 0, 0], "scale": [2.7, .18, 2.0]},
    {"name": "ReflectiveMask", "mesh": 0, "translation": [0, .18, 0], "scale": [2.1, .08, 1.45]},
    {"name": "ShieldingConcept-L", "mesh": 0, "translation": [-1.25, .35, 0], "scale": [.18, .55, 1.75]},
    {"name": "ShieldingConcept-R", "mesh": 0, "translation": [1.25, .35, 0], "scale": [.18, .55, 1.75]},
    {"name": "StageGuide-A", "mesh": 1, "translation": [0, -.25, -1.15], "scale": [.11, 2.5, .11]},
    {"name": "StageGuide-B", "mesh": 1, "translation": [0, -.25, 1.15], "scale": [.11, 2.5, .11]},
]

PROJECTION = [
    {"name": "OpticalBench", "mesh": 0, "translation": [0, 0, 0], "scale": [2.5, 3.3, 2.2]},
    {"name": "MirrorConcept-1", "mesh": 1, "translation": [-.65, 1.05, -.45], "rotation": [.7071, 0, 0, .7071], "scale": [.75, .09, .75]},
    {"name": "MirrorConcept-2", "mesh": 1, "translation": [.55, .45, .35], "rotation": [.7071, 0, 0, .7071], "scale": [.62, .08, .62]},
    {"name": "MirrorConcept-3", "mesh": 1, "translation": [-.35, -.25, -.35], "rotation": [.7071, 0, 0, .7071], "scale": [.7, .08, .7]},
    {"name": "MirrorConcept-4", "mesh": 1, "translation": [.55, -.95, .35], "rotation": [.7071, 0, 0, .7071], "scale": [.58, .08, .58]},
    {"name": "MetrologyFrame", "mesh": 0, "translation": [0, 0, 0], "scale": [2.9, .1, 2.6]},
]

VACUUM = [
    {"name": "VacuumPlatform", "mesh": 0, "translation": [0, 0, 0], "scale": [4.6, .45, 2.7]},
    {"name": "OpticalPathEnvelope", "mesh": 0, "translation": [0, .65, 0], "scale": [4.1, .12, 1.7]},
    {"name": "SourceInterfaceConcept", "mesh": 0, "translation": [-1.75, .55, 0], "scale": [.2, 1.25, 1.65]},
    {"name": "ReticleInterfaceConcept", "mesh": 0, "translation": [-.45, .95, 0], "scale": [.2, .75, 1.45]},
    {"name": "ProjectionInterfaceConcept", "mesh": 0, "translation": [.75, .55, 0], "scale": [.2, 1.35, 1.65]},
    {"name": "WaferInterfaceConcept", "mesh": 0, "translation": [1.75, .15, 0], "scale": [.2, .8, 1.55]},
    {"name": "AirlockConcept", "mesh": 0, "translation": [2.1, .7, 0], "scale": [.65, 1.1, 1.6]},
]

PRESETS = {
    "source": (SOURCE, "public/models/euv-source-collector-concept.gltf"),
    "illumination": (ILLUMINATION, "public/models/euv-illumination-concept.gltf"),
    "reticle": (RETICLE, "public/models/euv-reticle-concept.gltf"),
    "projection": (PROJECTION, "public/models/euv-projection-concept.gltf"),
    "vacuum": (VACUUM, "public/models/euv-vacuum-platform-concept.gltf"),
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Regenerate OpenEUV original concept glTF assets.")
    parser.add_argument("preset", choices=[*PRESETS, "all"], default="all", nargs="?")
    args = parser.parse_args()
    selected = PRESETS if args.preset == "all" else {args.preset: PRESETS[args.preset]}
    for name, (nodes, output) in selected.items():
        write_asset(nodes, output)
        print(f"generated {name}: {output}")

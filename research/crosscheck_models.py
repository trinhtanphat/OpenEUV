#!/usr/bin/env python3
import cmath
import json
import math
import sys


def rayleigh_resolution_nm(wavelength_nm: float, numerical_aperture: float, k1: float) -> float:
    return k1 * wavelength_nm / numerical_aperture


def layer_matrix(n_complex: complex, thickness_nm: float, wavelength_nm: float):
    delta = 2 * math.pi * n_complex * thickness_nm / wavelength_nm
    cosine = cmath.cos(delta)
    sine = cmath.sin(delta)
    return (
        (cosine, 1j * sine / n_complex),
        (1j * n_complex * sine, cosine),
    )


def multiply(a, b):
    return (
        (a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]),
        (a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]),
    )


def multilayer_normal_reflectivity(wavelength_nm, pairs, layer_a, layer_b, incident=(1.0, 0.0), substrate=(1.0, 0.0)):
    matrix = ((1 + 0j, 0 + 0j), (0 + 0j, 1 + 0j))
    for _ in range(int(pairs)):
        for layer in (layer_a, layer_b):
            n_complex = complex(layer["n"], -abs(layer["k"]))
            matrix = multiply(matrix, layer_matrix(n_complex, layer["thicknessNm"], wavelength_nm))
    eta0 = complex(incident[0], -abs(incident[1]))
    etas = complex(substrate[0], -abs(substrate[1]))
    b = matrix[0][0] + matrix[0][1] * etas
    c = matrix[1][0] + matrix[1][1] * etas
    denominator = eta0 * b + c
    reflection = (eta0 * b - c) / denominator if abs(denominator) > 1e-18 else 0j
    value = abs(reflection) ** 2
    return min(1.0, max(0.0, value))


def main():
    request = json.load(sys.stdin)
    resolution = request["resolution"]
    multilayer = request["multilayer"]
    output = {
        "resolutionNm": rayleigh_resolution_nm(
            resolution["wavelengthNm"], resolution["numericalAperture"], resolution["k1"]
        ),
        "multilayerNormalReflectivity": multilayer_normal_reflectivity(
            multilayer["wavelengthNm"],
            multilayer["pairs"],
            multilayer["materialA"],
            multilayer["materialB"],
        ),
    }
    json.dump(output, sys.stdout)


if __name__ == "__main__":
    main()

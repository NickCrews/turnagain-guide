"""usage: uv run scripts/collate-gaia-geojsons.py scripts/geojsons scripts/merged.geojson"""

import json
import sys
from pathlib import Path
from typing import Any, Iterable


def collate_geojsons(in_paths: str | Path | Iterable[str | Path], out_path: str | Path):
    """
    Combine multiple GeoJSON files into a single GeoJSON file.

    Parameters:
    in_paths (list of str): List of input GeoJSON file paths.
    out_path (str): Output path for the combined GeoJSON file.
    """
    if isinstance(in_paths, (str, Path)):
        in_paths = list(Path(in_paths).glob("*.geojson"))
    in_paths = list(in_paths)
    if not in_paths:
        raise ValueError("No input GeoJSON files found.")

    combined_features = []
    for in_path in in_paths:
        with open(in_path, "r") as f:
            data = json.load(f)
            if "features" in data:
                features = data["features"]
                features = [
                    # for tracks and areas, gaia includes all teh waypoints.
                    f
                    for f in features
                    if f["properties"].get("title") != "untitled"
                ]
                features = [process_feature(f) for f in features]
                combined_features.extend(features)

    print(f"Combined {len(combined_features)} features from {len(in_paths)} files.")
    combined_geojson = {"type": "FeatureCollection", "features": combined_features}

    with open(out_path, "w") as f:
        json.dump(combined_geojson, f, indent=4)


def process_feature(feat: dict[str, Any]):
    """Process a single feature to ensure it has the correct properties."""
    feat = {
        "type": "Feature",
        "properties": process_properties(feat.get("properties", {})),
        "geometry": process_geometry(feat["geometry"]),
    }
    return feat


def process_properties(props: dict[str, Any]):
    result = {}
    if "title" in props and props["title"] != "untitled":
        result["title"] = props["title"]
    if "latitude" in props and props["latitude"] is not None and props["latitude"] != 0:
        result["latitude"] = props["latitude"]
    if (
        "longitude" in props
        and props["longitude"] is not None
        and props["longitude"] != 0
    ):
        result["longitude"] = props["longitude"]
    if (
        "elevation" in props
        and props["elevation"] is not None
        and props["elevation"] != 0
    ):
        result["elevation"] = props["elevation"]
    if "distance" in props and props["distance"] is not None and props["distance"] != 0:
        result["distance"] = props["distance"]
    return result


def process_geometry(geo: dict[str, Any]):
    # gaia often outputs MultiLineStrings, which cesium can't handle.
    # So flatten them to LineStrings.
    if geo["type"] == "MultiLineString":
        geo["type"] = "LineString"
        geo["coordinates"] = [coord for line in geo["coordinates"] for coord in line]
    return geo


def cli():
    if len(sys.argv) != 3:
        print("Usage: python collate_geojson.py <input_pattern> <output_path>")
        sys.exit(1)

    input_paths = sys.argv[1]
    output_path = sys.argv[2]

    collate_geojsons(input_paths, output_path)


if __name__ == "__main__":
    cli()

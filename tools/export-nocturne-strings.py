"""Export the nine frozen Nocturne sentences without changing their diagrams.

Run with the existing lambeq 0.4.3 environment, for example::

    python -B tools/export-nocturne-strings.py

Checked-in CCG trees make ordinary regeneration independent of a parser model.
For a deliberate fresh parse, pass --reparse and --model PATH to a complete
local Bobcat model. All Hugging Face access is forced offline; this tool never
installs packages or downloads a model. The gallery cache is optional.

Geometry follows DrawableDiagram, including every Cup, Cap and Swap. Helpers
are traversed into continuous strands, but their identities remain in the data.
A swap crosses two strands; its centre is never a junction. This is a drawing
of syntax-derived tensor contraction, not computed lexical meaning.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from hashlib import sha256
import importlib.metadata
import json
import os
from pathlib import Path
import re
import sys

os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["MPLBACKEND"] = "Agg"
sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]
ASSET_PREFIX = "nocturne/strings"
CANDIDATES = [
    ("S", "让公交带我走",
     "I let the bus carry me through other people's evenings.",
     "我任公交载着我，穿过别人的夜晚。", "let + 裸不定式 + 路径"),
    ("M", "看城市入夜",
     "From across the river, I watch the city fill with other people's evenings.",
     "我隔着河，看城市渐渐盛满别人的夜晚。", "感知动词 + 裸不定式"),
    ("A", "隔岸城市",
     "The city across the river is full of other people's evenings.",
     "河对岸的城市，盛满了别人的夜晚。", "名词后置地点修饰"),
    ("C", "亮起的城市",
     "The city that glows across the river is full of other people's evenings.",
     "隔江亮着的那座城，盛满了别人的夜晚。", "主语关系从句"),
    ("R", "车窗里的片刻",
     "Through the bus window, I catch glimpses of other people's evenings.",
     "隔着公交车窗，我瞥见别人夜晚的几个片刻。", "前置地点 + 名词补足"),
    ("U", "我静坐，城市入夜",
     "I sit by the river while the city fills with other people's evenings.",
     "我坐在河边，城市渐渐盛满别人的夜晚。", "两个事件 + while 从句"),
    ("E", "留下观看者",
     "The city I watch is full of other people's evenings.",
     "我望着的这座城，盛满了别人的夜晚。", "零关系从句"),
    ("X", "为别人亮着的窗",
     "I let the bus carry me past windows lit for someone else.",
     "我任公交载着我，经过一扇扇为别人亮着的窗。", "let + 路径 + 过去分词修饰"),
    ("Y", "千百人的夜晚",
     "I watch a thousand evenings unfold across the river.",
     "我隔江望着，千百人的夜晚正徐徐展开。", "感知动词 + 裸不定式 + 地点"),
]


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")


def rounded(value: float) -> float:
    result = round(float(value), 6)
    return 0 if result == 0 else result


def type_info(obj) -> dict:
    return {"type": str(obj), "baseType": obj.name, "winding": obj.z}


def cubic_for_quadratic(start, control, end):
    return [list(start),
            [start[i] + (control[i] - start[i]) * 2 / 3 for i in (0, 1)],
            [end[i] + (control[i] - end[i]) * 2 / 3 for i in (0, 1)],
            list(end)]


def continuous_geometry(diagram) -> dict:
    """Preserve the drawable's graph, rather than inferring cups from text."""
    from lambeq.backend.drawing.drawable import DrawableDiagram

    drawable = DrawableDiagram.from_diagram(diagram)
    word_nodes = [node for node in drawable.boxes
                  if type(node.obj).__name__ == "Word"]
    if not word_nodes:
        raise ValueError("Expected lexical Word states")
    word_top = max(node.y + 0.25 for node in word_nodes)
    left = min(node.get_x_lims(drawable)[0] for node in word_nodes)
    if max(node.y for node in word_nodes) != min(node.y for node in word_nodes):
        raise ValueError("Lexical states unexpectedly occupy different rows")

    def point(raw):
        return [rounded(raw[0] - left), rounded(word_top - raw[1])]

    ports = drawable.wire_endpoints
    point_at = lambda index: point(ports[index].coordinates)
    edges = []
    adjacency = defaultdict(list)
    terminals = {}
    words = []
    helpers = []
    outputs = []

    def add_edge(a, b, curves, kind, helper_id=None):
        edge_id = len(edges)
        edges.append({"a": a, "b": b,
                      "curves": [[[rounded(v) for v in p] for p in curve]
                                 for curve in curves],
                      "kind": kind, "helperId": helper_id})
        adjacency[a].append(edge_id)
        adjacency[b].append(edge_id)

    def curve(start, end, bend_out=False):
        # This is the same quadratic control rule used by lambeq's MatBackend.
        control = [end[0], start[1]] if bend_out else [start[0], end[1]]
        return cubic_for_quadratic(start, control, end)

    for index, node in enumerate(word_nodes):
        if node.dom_wires:
            raise ValueError("Expected words to be states, with no input ports")
        word_id = f"w{index}"
        x0, x1 = node.get_x_lims(drawable)
        word = {"id": word_id, "index": index, "text": node.obj.name,
                "x": rounded(x0 - left), "y": 0,
                "width": rounded(x1 - x0), "height": 0.5,
                "centerX": rounded(node.x - left), "ports": []}
        for port_index in node.cod_wires:
            p = ports[port_index]
            x, y = point_at(port_index)
            port = {"id": f"p{port_index}", "x": x, "y": y,
                    **type_info(p.obj)}
            word["ports"].append(port)
            terminals[port_index] = {"kind": "word", "wordId": word_id,
                                     "portId": port["id"], "x": x, "y": y,
                                     "type": port["type"]}
        words.append(word)

    for index, port in enumerate(ports):
        if port.kind.name == "OUTPUT":
            x, y = point_at(index)
            output = {"id": f"p{index}", "x": x, "y": y,
                      **type_info(port.obj)}
            outputs.append(output)
            terminals[index] = {"kind": "output", "portId": output["id"],
                                "x": x, "y": y, "type": output["type"]}
        elif port.kind.name == "INPUT":
            raise ValueError("Sentence diagrams should have an empty domain")

    for source, target in drawable.wires:
        add_edge(source, target, [curve(point_at(source), point_at(target))],
                 "wire")

    for index, node in enumerate(drawable.boxes):
        kind = type(node.obj).__name__
        if kind == "Word":
            continue
        helper_id = f"h{index}"
        center = point(node.coordinates)
        if kind == "Cup":
            assert len(node.dom_wires) == 2 and not node.cod_wires
            a, b = node.dom_wires
            connections = [(a, b)]
            curves = [curve(point_at(a), center),
                      list(reversed(curve(point_at(b), center)))]
            add_edge(a, b, curves, "cup", helper_id)
        elif kind == "Cap":
            assert len(node.cod_wires) == 2 and not node.dom_wires
            a, b = node.cod_wires
            connections = [(a, b)]
            curves = [list(reversed(curve(center, point_at(a), True))),
                      curve(center, point_at(b), True)]
            add_edge(a, b, curves, "cap", helper_id)
        elif kind == "Swap":
            assert len(node.dom_wires) == len(node.cod_wires) == 2
            connections = [(node.dom_wires[0], node.cod_wires[1]),
                           (node.dom_wires[1], node.cod_wires[0])]
            for a, b in connections:
                add_edge(a, b, [curve(point_at(a), center),
                                curve(center, point_at(b), True)],
                         "swap", helper_id)
        else:
            raise ValueError(f"Unsupported helper {kind}; do not invent wiring")
        helper_ports = []
        for port_index in node.dom_wires + node.cod_wires:
            x, y = point_at(port_index)
            helper_ports.append({"id": f"p{port_index}", "x": x, "y": y,
                                 "kind": ports[port_index].kind.name.lower(),
                                 **type_info(ports[port_index].obj)})
        helpers.append({"id": helper_id, "kind": kind,
                        "x": center[0], "y": center[1],
                        "domPortIds": [f"p{i}" for i in node.dom_wires],
                        "codPortIds": [f"p{i}" for i in node.cod_wires],
                        "ports": helper_ports,
                        "connections": [[f"p{a}", f"p{b}"]
                                        for a, b in connections],
                        "strandIds": []})

    for port_index in range(len(ports)):
        expected_degree = 1 if port_index in terminals else 2
        if len(adjacency[port_index]) != expected_degree:
            raise ValueError(f"Port p{port_index} has the wrong connectivity")

    visited_edges = set()
    strands = []
    helper_by_id = {helper["id"]: helper for helper in helpers}
    for start in terminals:
        if all(edge in visited_edges for edge in adjacency[start]):
            continue
        current = start
        commands = [{"op": "M", "points": [point_at(start)]}]
        helper_ids = []
        segment_provenance = []
        while True:
            remaining = [edge for edge in adjacency[current]
                         if edge not in visited_edges]
            if not remaining:
                raise ValueError("A strand stopped before reaching a terminal")
            edge_index = remaining[0]
            edge = edges[edge_index]
            visited_edges.add(edge_index)
            forward = current == edge["a"]
            oriented_curves = (edge["curves"] if forward else
                               [list(reversed(c))
                                for c in reversed(edge["curves"])])
            command_start = len(commands)
            for c in oriented_curves:
                if commands[-1]["points"][-1] != c[0]:
                    raise ValueError("Discontinuous strand geometry")
                commands.append({"op": "C", "points": c[1:]})
            segment_provenance.append({"kind": edge["kind"],
                                       "helperId": edge["helperId"],
                                       "commandStart": command_start,
                                       "commandCount": len(oriented_curves)})
            if edge["helperId"] and edge["helperId"] not in helper_ids:
                helper_ids.append(edge["helperId"])
            current = edge["b"] if forward else edge["a"]
            if current in terminals:
                break
        endpoint_records = [terminals[start], terminals[current]]
        word_ids = list(dict.fromkeys(endpoint["wordId"]
                                     for endpoint in endpoint_records
                                     if endpoint["kind"] == "word"))
        strand_id = f"strand-{len(strands)}"
        d = " ".join(command["op"] + " " + " ".join(
            f"{p[0]:g},{p[1]:g}" for p in command["points"])
                     for command in commands)
        strands.append({"id": strand_id, "d": d, "commands": commands,
                        "wordIds": word_ids, "endpoints": endpoint_records,
                        "helperIds": helper_ids,
                        "segments": segment_provenance,
                        "role": ("sentence" if any(e["kind"] == "output"
                                                   for e in endpoint_records)
                                 else "connection")})
        for helper_id in helper_ids:
            helper_by_id[helper_id]["strandIds"].append(strand_id)

    if len(visited_edges) != len(edges):
        raise ValueError("Untraced closed component; explicit handling required")
    if len(outputs) != 1 or outputs[0]["type"] != "s":
        raise ValueError("Expected precisely one sentence output")
    for helper in helpers:
        expected = 2 if helper["kind"] == "Swap" else 1
        if len(helper["strandIds"]) != expected:
            raise ValueError("A helper's continuous strands were not preserved")

    all_points = [p for strand in strands for command in strand["commands"]
                  for p in command["points"]]
    bounds = {"x": 0, "y": 0,
              "width": rounded(max(max(p[0] for p in all_points),
                                   max(w["x"] + w["width"] for w in words))),
              "height": rounded(max(p[1] for p in all_points))}
    if min(p[0] for p in all_points) < 0 or min(p[1] for p in all_points) < 0:
        raise ValueError("Unexpected geometry outside positive coordinate bounds")
    counts = Counter(type(box).__name__ for box in diagram.boxes)
    return {"words": words, "strands": strands, "helpers": helpers,
            "outputs": outputs, "bounds": bounds,
            "stats": {"words": len(words), "cups": counts["Cup"],
                      "caps": counts["Cap"], "swaps": counts["Swap"],
                      "ports": sum(len(w["ports"]) for w in words),
                      "strands": len(strands), "output": str(diagram.cod),
                      "is_pregroup": diagram.is_pregroup,
                      "width": bounds["width"], "height": bounds["height"],
                      "graphEdges": len(edges), "tracedEdges": len(visited_edges)}}


def leaf_tokens(tree):
    if "text" in tree:
        return [tree["text"]]
    return [word for child in tree.get("children", [])
            for word in leaf_tokens(child)]


def raw_render(diagram, path: Path) -> None:
    import matplotlib.pyplot as plt
    from lambeq.backend.drawing.drawable import DrawableDiagram

    drawable = DrawableDiagram.from_diagram(diagram)
    nodes = drawable.boxes + drawable.wire_endpoints
    width = max(n.x for n in nodes) - min(n.x for n in nodes)
    height = max(n.y for n in nodes) - min(n.y for n in nodes)
    path.parent.mkdir(parents=True, exist_ok=True)
    diagram.draw(draw_as_pregroup=False, path=str(path), show=False,
                 figsize=(width * 0.30 + 1.2, height * 0.85 + 1.0),
                 fontsize=13, fontsize_types=11, draw_type_labels=True,
                 margins=(0.02, 0.08))
    plt.close("all")
    if path.suffix == ".svg":
        # Matplotlib adds a wall-clock date; omit it to make reruns stable.
        svg = path.read_text(encoding="utf-8")
        svg = re.sub(r"\s*<dc:date>.*?</dc:date>", "", svg)
        svg = "\n".join(line.rstrip() for line in svg.splitlines()) + "\n"
        path.write_text(svg, encoding="utf-8")


def main() -> None:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--output", type=Path,
                     default=ROOT / "themes/nocturne/source/nocturne/strings")
    cli.add_argument("--cache", type=Path,
                     default=ROOT / ".nocturne-preview/hero-lab/discocat-variants")
    cli.add_argument("--model", type=Path,
                     default=Path.home() / ".cache/lambeq/bobcat/bert")
    cli.add_argument("--reparse", action="store_true",
                     help="Regenerate all CCG trees using the existing local model")
    args = cli.parse_args()

    import matplotlib
    matplotlib.use("Agg")
    matplotlib.rcParams.update({"savefig.dpi": 180, "svg.fonttype": "none",
                                "svg.hashsalt": "nocturne-strings-v1"})
    from lambeq import BobcatParser
    from lambeq.text2diagram.ccg_tree import CCGTree

    versions = {name: importlib.metadata.version(name)
                for name in ("lambeq", "matplotlib", "spacy", "torch")}
    if versions["lambeq"] != "0.4.3":
        raise RuntimeError("This reproducible export requires lambeq 0.4.3; "
                           "review API and diagram changes before updating it")
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    parser = tokenizer = None
    catalog = {"schemaVersion": 1, "defaultId": "S",
               "coordinateSystem": {"unit": "lambeq drawing unit",
                                    "xDirection": "right", "yDirection": "down",
                                    "wordTop": 0, "wordHeight": 0.5},
               "method": {"generator": "tools/export-nocturne-strings.py",
                          "versions": versions, "parser": "Bobcat (local bert)",
                          "tokenizer": "spaCy blank English tokenizer",
                          "conversion": "CCGTree.to_diagram(planar=False, collapse_noun_phrases=True)",
                          "rewrites": [],
                          "geometry": "DrawableDiagram; exact quadratic-to-cubic conversion; continuous strands retain all helper connections",
                          "semantics": "Syntactic composition only; no learned lexical tensors or sentence vectors are evaluated."},
               "variants": []}

    for identifier, title, sentence, translation, structure in CANDIDATES:
        ccg_path = output / "provenance" / f"{identifier}-ccg.json"
        cached_path = args.cache / f"{identifier}-ccg.json"
        tree_path = next((p for p in (ccg_path, cached_path) if p.is_file()), None)
        if tree_path and not args.reparse:
            tree_json = json.loads(tree_path.read_text(encoding="utf-8-sig"))
            tree = CCGTree.from_json(tree_json)
            if "".join(leaf_tokens(tree_json)) != re.sub(r"\s+", "", sentence):
                raise ValueError(f"{identifier}: cached CCG does not match frozen sentence")
        else:
            if parser is None:
                if not (args.model / "pytorch_model.bin").is_file():
                    raise FileNotFoundError("Missing local Bobcat model; no download will be attempted")
                import spacy
                tokenizer = spacy.blank("en").tokenizer
                parser = BobcatParser(model_name_or_path=str(args.model.resolve()),
                                      verbose="suppress")
            tokens = [token.text for token in tokenizer(sentence)]
            tree = parser.sentence2tree(tokens, tokenised=True)
            tree_json = tree.to_json()
        diagram = tree.to_diagram(planar=False, collapse_noun_phrases=True)
        if str(diagram.cod) != "s":
            raise ValueError(f"{identifier}: unexpected output {diagram.cod}")
        geometry = continuous_geometry(diagram)
        write_json(ccg_path, tree_json)
        diagram_path = output / "provenance" / f"{identifier}-diagram.json"
        write_json(diagram_path, diagram.to_json())
        raw_path = output / "raw" / f"{identifier}.svg"
        raw_render(diagram, raw_path)
        row = {"id": identifier, "title": title, "sentence": sentence,
               "translation": translation, "structure": structure,
               "tokens": leaf_tokens(tree_json), **geometry,
               "rawSvg": f"{ASSET_PREFIX}/raw/{identifier}.svg",
               "provenance": {"ccg": f"{ASSET_PREFIX}/provenance/{identifier}-ccg.json",
                              "diagram": f"{ASSET_PREFIX}/provenance/{identifier}-diagram.json",
                              "ccgSha256": sha256(ccg_path.read_bytes()).hexdigest()}}
        catalog["variants"].append(row)
        # Keep the old gallery and manifest untouched; only add the two new exports.
        if identifier in ("X", "Y") and args.cache.is_dir():
            write_json(cached_path, tree_json)
            write_json(args.cache / f"{identifier}-diagram.json", diagram.to_json())
            (args.cache / f"{identifier}-ccg.txt").write_text(tree.deriv(), encoding="utf-8")
            for extension in ("svg", "png", "pdf"):
                raw_render(diagram, args.cache / f"{identifier}.{extension}")
        print(json.dumps({"id": identifier, **row["stats"]}), flush=True)

    expected = {row[0] for row in CANDIDATES}
    assert {v["id"] for v in catalog["variants"]} == expected
    e = next(v for v in catalog["variants"] if v["id"] == "E")
    assert e["stats"]["caps"] == e["stats"]["swaps"] == 1, "E's raw cap/swap must survive"
    write_json(output / "candidates.json", catalog)
    print(f"Exported {len(catalog['variants'])} faithful diagrams to {output}")


if __name__ == "__main__":
    main()

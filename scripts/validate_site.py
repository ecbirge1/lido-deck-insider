from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
IGNORED_DIRS = {'.git', '.github', 'scripts'}


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        if tag in {'a', 'link'} and attr_map.get('href'):
            self.links.append((tag, attr_map['href'] or ''))
        if tag in {'script', 'img', 'source'} and attr_map.get('src'):
            self.links.append((tag, attr_map['src'] or ''))


def html_files() -> list[Path]:
    return [
        path
        for path in ROOT.rglob('*.html')
        if not any(part in IGNORED_DIRS for part in path.parts)
    ]


def resolve_local(source: Path, raw: str) -> Path | None:
    value = raw.strip()
    if not value or value.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:')):
        return None
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc:
        return None
    clean = unquote(parsed.path)
    if not clean:
        return None
    target = (ROOT / clean.lstrip('/')) if clean.startswith('/') else (source.parent / clean)
    target = target.resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return None
    if clean.endswith('/'):
        target = target / 'index.html'
    return target


def validate_links() -> list[str]:
    errors: list[str] = []
    for page in html_files():
        parser = LinkParser()
        parser.feed(page.read_text(encoding='utf-8'))
        for tag, raw in parser.links:
            target = resolve_local(page, raw)
            if target is None:
                continue
            if target.exists():
                continue
            if target.suffix == '' and target.with_suffix('.html').exists():
                continue
            errors.append(f'{page.relative_to(ROOT)}: missing {tag} target {raw}')
    return errors


def validate_required_pages() -> list[str]:
    required = [
        'index.html',
        'ships/fleet.html',
        'ship-matcher.html',
        'products/cruise-planning-toolkit.html',
        'guides/embarkation-day.html',
        'guides/cabin-selection.html',
        'guides/port-day.html',
    ]
    return [f'missing required page: {path}' for path in required if not (ROOT / path).exists()]


def validate_page_basics() -> list[str]:
    errors: list[str] = []
    for page in html_files():
        text = page.read_text(encoding='utf-8').lower()
        rel = page.relative_to(ROOT)
        if '<title>' not in text:
            errors.append(f'{rel}: missing <title>')
        if 'name="viewport"' not in text and "name='viewport'" not in text:
            errors.append(f'{rel}: missing viewport meta tag')
        if '<h1' not in text:
            errors.append(f'{rel}: missing h1')
    return errors


def main() -> int:
    errors = validate_required_pages() + validate_links() + validate_page_basics()
    if errors:
        print('Site validation failed:')
        for error in errors:
            print(f' - {error}')
        return 1
    print(f'Site validation passed for {len(html_files())} HTML pages.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

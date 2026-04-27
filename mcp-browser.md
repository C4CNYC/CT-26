# MCP Browser Automation

## Essential Tools

Core tools registered via pi-mcp-adapter proxy `mcp()`:

| Tool | Use |
|------|-----|
| `navigate_page` | Go to URL, back, forward, reload |
| `new_page` | Open new tab |
| `list_pages` | See open tabs |
| `select_page` | Switch tab context |
| `take_snapshot` | Get page structure (accessible text tree) |
| `take_screenshot` | Capture image |
| `click` | Click element by uid |
| `fill` | Type into inputs |
| `type_text` | Type via keyboard |
| `wait_for` | Wait for text to appear |

## Workflow

1. `navigate_page({ type: "url", url: "..." })`
2. `take_snapshot()` - get uids
3. `click({ uid: "..." })` or `fill({ uid: "...", value: "..." })`
4. Repeat as needed
5. `take_snapshot()` to verify state

## Call Pattern

```
mcp({ tool: "chrome_devtools_<name>", args: '{"key": "value"}' })
```

**Note:** args is JSON string, not object.

## Reduce Return Data

- Default `includeSnapshot: false` - keeps output small
- Default `verbose: false` for snapshots
- Avoid `list_network_requests`, `list_console_messages` - verbose
- Avoid `lighthouse_audit`, `performance_*` - unless needed

## Page Snapshots

Returns a11y tree with unique `uid` for each element. Always use latest snapshot.

Example:
```
[1] uid: button-123
    Button "Submit"

[2] uid: input-456
    Text input
```

Then use uid: `mcp({ tool: "chrome_devtools_click", args: '{"uid": "button-123"}' })`

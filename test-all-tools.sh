#!/bin/bash
BASE="https://fluentcrm-mcp-server.onrender.com/mcp"
TOKEN="oqFZEDCpfcTeOr8j2iUGDLJuBbaRXQbT003V307r4YDH6FR6wX0w6zrSbLaI6MdA"
NGROK="https://c923-74-96-113-19.ngrok-free.app/wp-json/fluent-crm/v2"
CID=2; PASS=0; FAIL=0

call() {
  local label="$1" tool="$2" args="$3"
  CID=$((CID+1))
  local payload="{\"jsonrpc\":\"2.0\",\"id\":$CID,\"method\":\"tools/call\",\"params\":{\"name\":\"$tool\",\"arguments\":$args}}"
  local result isErr text
  result=$(curl -s -X POST "$BASE" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "mcp-session-id: $SID" \
    -d "$payload" -m 60 | grep '^data:' | sed 's/^data: //')
  isErr=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('result',{}).get('isError','false'))" 2>/dev/null)
  if [[ "$isErr" == "True" || "$isErr" == "true" ]]; then
    text=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result']['content'][0]['text'][:80])" 2>/dev/null)
    printf "  [FAIL] %-44s %s\n" "$label" "$text"
    FAIL=$((FAIL+1))
  else
    text=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); import re; t=d.get('result',{}).get('content',[{}])[0].get('text',''); print(re.sub(r'\s+',' ',t)[:70])" 2>/dev/null)
    printf "  [ OK ] %-44s %s\n" "$label" "$text"
    PASS=$((PASS+1))
  fi
}

echo "==> Waking Render server..."
curl -s "$BASE" -m 60 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"warmup","version":"1.0"}}}' > /dev/null 2>&1

echo "==> Initializing MCP session..."
SID=$(curl -si -X POST "$BASE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-FluentCRM-Url: $NGROK" \
  -H "X-FluentCRM-Username: MCP User" \
  -H "X-FluentCRM-Password: IUN0 4aGT DghR Ec2D 1Khs 8jrS" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  -m 60 | grep -i "mcp-session-id" | awk '{print $2}' | tr -d '\r')
echo "Session: $SID"
echo ""

echo "[ CONTACTS ]"
call "list_contacts"            fluentcrm_list_contacts           '{"per_page":3}'
call "create_contact"           fluentcrm_create_contact          '{"email":"john.doe@example.com","first_name":"John","last_name":"Doe","phone":"5713547323","address_line_1":"3106 Fennegan Court","city":"Woodbridge","country":"US","status":"subscribed"}'
call "find_contact_by_email"    fluentcrm_find_contact_by_email   '{"email":"john.doe@example.com"}'
call "get_contact (id=1)"       fluentcrm_get_contact             '{"subscriberId":1}'
call "update_contact (id=1)"    fluentcrm_update_contact          '{"subscriberId":1,"phone":"5551234567"}'
echo ""

echo "[ TAGS ]"
call "list_tags"                fluentcrm_list_tags               '{}'
call "create_tag"               fluentcrm_create_tag              '{"title":"test-tool-tag"}'
call "attach_tag_to_contact"    fluentcrm_attach_tag_to_contact   '{"subscriberId":1,"tagIds":[1]}'
call "detach_tag_from_contact"  fluentcrm_detach_tag_from_contact '{"subscriberId":1,"tagIds":[1]}'
echo ""

echo "[ LISTS ]"
call "list_lists"               fluentcrm_list_lists              '{}'
call "create_list"              fluentcrm_create_list             '{"title":"test-tool-list"}'
call "attach_contact_to_list"   fluentcrm_attach_contact_to_list  '{"subscriberId":1,"listIds":[1]}'
call "detach_contact_from_list" fluentcrm_detach_contact_from_list '{"subscriberId":1,"listIds":[1]}'
echo ""

echo "[ CAMPAIGNS ]"
call "list_campaigns"           fluentcrm_list_campaigns          '{}'
call "create_campaign"          fluentcrm_create_campaign         '{"title":"Test Campaign","subject":"Hello","from_name":"Test","from_email":"test@example.com"}'
echo ""

echo "[ EMAIL TEMPLATES ]"
call "list_email_templates"     fluentcrm_list_email_templates    '{}'
call "create_email_template"    fluentcrm_create_email_template   '{"title":"Test Template","subject":"Test Subject","body":"<p>Hello world</p>"}'
echo ""

echo "[ AUTOMATIONS ]"
call "list_automations"         fluentcrm_list_automations        '{}'
echo ""

echo "[ WEBHOOKS ]"
call "list_webhooks"            fluentcrm_list_webhooks           '{}'
call "create_webhook"           fluentcrm_create_webhook          '{"name":"Test Hook","url":"https://example.com/hook","events":["contact_created"]}'
echo ""

echo "[ SMART LINKS ]"
call "list_smart_links"         fluentcrm_list_smart_links        '{}'
call "create_smart_link"        fluentcrm_create_smart_link       '{"title":"Test Link","url":"https://example.com","action":"redirect"}'
call "validate_smart_link_data" fluentcrm_validate_smart_link_data '{"url":"https://example.com","action":"redirect"}'
echo ""

echo "[ DASHBOARD & CUSTOM FIELDS ]"
call "dashboard_stats"          fluentcrm_dashboard_stats         '{}'
call "custom_fields"            fluentcrm_custom_fields           '{}'
echo ""

echo "================================================"
echo "  PASSED: $PASS   FAILED: $FAIL   TOTAL: $((PASS+FAIL))"
echo "================================================"

import json
from django.core.serializers.json import DjangoJSONEncoder


def mark_details_to_json(mark):
    """Shows mark info excluding children/parents"""
    return {
        "id": mark.id,
        "description": mark.description,
        "created_at": json.loads(json.dumps(mark.created_at, cls=DjangoJSONEncoder)),
        "modified_at": json.loads(json.dumps(mark.modified_at, cls=DjangoJSONEncoder)),
    }

def mark_mapping_to_json(mark_mapping):
    """Mapping of mark in json form"""
    result = {
        "node": mark_details_to_json(mark_mapping["node"])
    }

    if 'parents' in mark_mapping:
        result['parents'] = []
        for parent in mark_mapping['parents']:
            result['parents'].append(
                mark_details_to_json(parent)
            )

    if 'children' in mark_mapping:
        result['children'] = []
        for child_mapping in mark_mapping['children']:
            result['children'].append(
                mark_mapping_to_json(child_mapping)
            )

    return result

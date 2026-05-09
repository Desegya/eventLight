# Search & Filter — Backend Requirements

This document describes the exact API changes needed so the frontend can wire up live search, category filtering, and sidebar filters.

---

## Current state

`GET /api/events/` returns all approved events with no parameters. The frontend fetches everything on load and does nothing with search/filter input (they are console-logged placeholders).

---

## What the frontend needs

### 1. Query-parameter filtering on `GET /api/events/`

The endpoint must accept the following optional query parameters. All are combinable.

| Parameter | Type | Example | Notes |
|---|---|---|---|
| `search` | `string` | `?search=shiloh` | Full-text match on `title`, `description`, `location` |
| `category` | `string` | `?category=worship` | Exact match on `category` field |
| `pricing` | `string` | `?pricing=free` | `free` or `paid` |
| `event_type` | `string` | `?event_type=conference` | Exact match |
| `language` | `string` | `?language=english` | Exact match |
| `age_group` | `string` | `?age_group=young_adults` | Exact match |
| `ordering` | `string` | `?ordering=date` or `?ordering=-date` | Sort field; prefix `-` for descending |
| `page` | `int` | `?page=2` | Page number for pagination |
| `page_size` | `int` | `?page_size=12` | Items per page (default 12, max 50) |

**Django REST Framework implementation**: install `django-filter` and add a `FilterSet` to the events viewset, plus `SearchFilter` and `OrderingFilter` from `rest_framework.filters`.

```python
# views.py
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

class EventViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'pricing', 'event_type', 'language', 'age_group']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'created_at', 'title']
    ordering = ['date']
```

---

### 2. Paginated response shape

The frontend currently expects `Event[]` from `GET /api/events/`. Once pagination is added, the response shape changes to:

```json
{
  "count": 143,
  "next": "http://localhost:8000/api/events/?page=2",
  "previous": null,
  "results": [ ...Event[] ]
}
```

The frontend `apiService.getEvents()` and `useEvents` hook will be updated to handle this shape once the backend returns it. **Let me know when this is deployed so I can update the hook.**

---

### 3. No new endpoints needed

All filtering and search should happen on the existing `GET /api/events/` endpoint via query parameters. No new routes are required.

---

## Summary checklist for the backend dev

- [ ] Install `django-filter` (`pip install django-filter`, add `'django_filters'` to `INSTALLED_APPS`)
- [ ] Add `DjangoFilterBackend`, `SearchFilter`, `OrderingFilter` to the events viewset
- [ ] Set `filterset_fields`, `search_fields`, `ordering_fields` as shown above
- [ ] Enable DRF pagination — `PageNumberPagination` with `page_size = 12` in `REST_FRAMEWORK` settings
- [ ] Return paginated response (`count`, `next`, `previous`, `results`) from `GET /api/events/`
- [ ] Confirm all filter params work: `search`, `category`, `pricing`, `event_type`, `language`, `age_group`, `ordering`, `page`, `page_size`

---

## What happens on the frontend once this is deployed

1. The search bar in the navbar will fire `GET /api/events/?search=<query>` on submit
2. The category pills (CategoryFilter) will fire `GET /api/events/?category=<slug>`
3. The sidebar filters will combine params: `GET /api/events/?pricing=free&language=english&age_group=young_adults`
4. The EventGrid pagination will switch from client-side page slicing to `GET /api/events/?page=2`
5. All of this will compose cleanly because they all hit the same endpoint with different query strings

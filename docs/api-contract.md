
---

# `docs/api-contract.md`

```markdown
# VIERP Timetable POC — API Contract

## 1. Purpose

This document defines the REST API contract between the Vue frontend, Grails backend, and internal data layer.

The API contract should remain stable while the internal implementation evolves.

---

## 2. Base URL

For local development:

```text
http://localhost:<PORT>/apiz